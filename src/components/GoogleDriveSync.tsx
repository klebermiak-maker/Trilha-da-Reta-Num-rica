import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  Cloud,
  Download,
  Trash2,
  ExternalLink,
  RefreshCw,
  FileText,
  AlertTriangle,
  FolderCheck,
  CheckCircle2,
  Upload,
  LogOut,
  Info,
} from 'lucide-react';
import {
  listDriveFiles,
  saveProgressToDrive,
  saveReportToDrive,
  loadProgressFromDrive,
  deleteDriveFile,
  DriveFileItem,
  DriveProgressSaveData,
} from '../services/driveService';
import { googleSignIn, logout } from '../services/googleAuth';
import { GameLevel, LevelProgress } from '../types/game';

interface GoogleDriveSyncProps {
  currentUser: User | null;
  accessToken: string | null;
  progressMap: Record<number, LevelProgress>;
  levels: GameLevel[];
  onApplyLoadedProgress: (progress: Record<number, LevelProgress>) => void;
  onAuthSuccess: (user: User, token: string) => void;
  onAuthLogout: () => void;
}

export const GoogleDriveSync: React.FC<GoogleDriveSyncProps> = ({
  currentUser,
  accessToken,
  progressMap,
  levels,
  onApplyLoadedProgress,
  onAuthSuccess,
  onAuthLogout,
}) => {
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Destructive action confirmation state
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Restore action confirmation state
  const [fileToRestore, setFileToRestore] = useState<DriveFileItem | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const fetchFiles = async (token = accessToken) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await listDriveFiles(token, "trashed = false and (name contains 'progresso_reta' or name contains 'Relatorio_Desempenho' or mimeType = 'application/vnd.google-apps.folder')", 30);
      setFiles(data);
    } catch (err: unknown) {
      console.error('Erro ao buscar arquivos:', err);
      const msg = err instanceof Error ? err.message : 'Falha ao buscar arquivos do Google Drive';
      setFeedback({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchFiles(accessToken);
    } else {
      setFiles([]);
    }
  }, [accessToken]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    setFeedback(null);
    try {
      const res = await googleSignIn();
      if (res) {
        onAuthSuccess(res.user, res.accessToken);
        setFeedback({ type: 'success', text: `Conectado com sucesso como ${res.user.displayName || res.user.email}!` });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha no login com Google';
      setFeedback({ type: 'error', text: msg });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onAuthLogout();
    setFeedback({ type: 'info', text: 'Você se desconectou do Google Drive.' });
  };

  // Compute metrics
  const totalScore = Object.values(progressMap).reduce((acc, p) => acc + (p.bestScore || 0), 0);
  const totalStars = Object.values(progressMap).reduce((acc, p) => acc + (p.stars || 0), 0);
  const completedCount = Object.values(progressMap).filter((p) => p.completed).length;

  const handleSaveBackup = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const backupData: DriveProgressSaveData = {
        savedAt: new Date().toISOString(),
        appName: 'Trilha da Reta Numérica',
        appletId: '19134a93-48d3-495e-b513-004ed93e56dd',
        studentName: studentName.trim() || undefined,
        totalScore,
        totalStars,
        completedCount,
        progressMap,
      };

      const created = await saveProgressToDrive(accessToken, backupData);
      setFeedback({
        type: 'success',
        text: `Progresso salvo com sucesso no Google Drive na pasta "Trilha da Reta Numerica"! (${created.name})`,
      });
      fetchFiles(accessToken);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar progresso no Google Drive';
      setFeedback({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const studentLabel = studentName.trim() || 'Estudante';
      const dateStr = new Date().toLocaleDateString('pt-BR');

      const levelsRows = levels
        .map((lvl) => {
          const p = progressMap[lvl.id];
          const status = p?.completed ? 'Concluído' : (p?.bestScore || 0) > 0 ? 'Em andamento' : 'Pendente';
          return `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Nível ${lvl.id}: ${lvl.title}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lvl.bnccCode}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${p?.bestScore || 0} pts</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${'★'.repeat(p?.stars || 0)}${'☆'.repeat(3 - (p?.stars || 0))}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${status}</td>
          </tr>`;
        })
        .join('');

      const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório Escolar — Trilha da Reta Numérica</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f8fafc; color: #0f172a; padding: 40px; }
    .card { background: #fff; max-width: 800px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    h1 { color: #0369a1; font-size: 24px; margin-bottom: 8px; }
    .stats { display: flex; gap: 20px; margin: 24px 0; padding: 16px; background: #f0f9ff; border-radius: 8px; }
    .stat-item { flex: 1; }
    .stat-val { font-size: 22px; font-weight: bold; color: #0369a1; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
    th { text-align: left; padding: 10px; background: #f1f5f9; border-bottom: 2px solid #cbd5e1; }
    footer { margin-top: 32px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Trilha da Reta Numérica — Relatório de Aprendizagem</h1>
    <p>Aluno(a): <strong>${studentLabel}</strong> &middot; Data: <strong>${dateStr}</strong></p>
    
    <div class="stats">
      <div class="stat-item">
        <div>Pontos Conquistados</div>
        <div class="stat-val">${totalScore} pts</div>
      </div>
      <div class="stat-item">
        <div>Níveis Concluídos</div>
        <div class="stat-val">${completedCount} de 8</div>
      </div>
      <div class="stat-item">
        <div>Estrelas Totais</div>
        <div class="stat-val">${totalStars} / 24</div>
      </div>
    </div>

    <h3>Desempenho por Habilidade / Nível</h3>
    <table>
      <thead>
        <tr>
          <th>Nível / Conteúdo</th>
          <th>Habilidade BNCC</th>
          <th>Pontuação</th>
          <th>Estrelas</th>
          <th>Situação</th>
        </tr>
      </thead>
      <tbody>
        ${levelsRows}
      </tbody>
    </table>

    <footer>
      Relatório gerado automaticamente e armazenado no Google Drive do usuário com permissão.
    </footer>
  </div>
</body>
</html>`;

      const created = await saveReportToDrive(accessToken, studentLabel, htmlContent);
      setFeedback({
        type: 'success',
        text: `Relatório exportado com sucesso no Google Drive! (${created.name})`,
      });
      fetchFiles(accessToken);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar relatório no Google Drive';
      setFeedback({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm and execute restore
  const executeRestore = async () => {
    if (!accessToken || !fileToRestore) return;
    setIsRestoring(true);
    setFeedback(null);
    try {
      const loaded = await loadProgressFromDrive(accessToken, fileToRestore.id);
      if (loaded && loaded.progressMap) {
        onApplyLoadedProgress(loaded.progressMap);
        setFeedback({
          type: 'success',
          text: `Progresso de "${fileToRestore.name}" restaurado com sucesso! (${loaded.totalScore} pts, ${loaded.completedCount} níveis)`,
        });
      } else {
        throw new Error('O arquivo selecionado não contém um formato de progresso válido.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao restaurar progresso';
      setFeedback({ type: 'error', text: msg });
    } finally {
      setIsRestoring(false);
      setFileToRestore(null);
    }
  };

  // Confirm and execute file deletion
  const executeDelete = async () => {
    if (!accessToken || !fileToDelete) return;
    setIsDeleting(true);
    setFeedback(null);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setFeedback({
        type: 'success',
        text: `Arquivo "${fileToDelete.name}" removido com sucesso do Google Drive.`,
      });
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao remover arquivo';
      setFeedback({ type: 'error', text: msg });
    } finally {
      setIsDeleting(false);
      setFileToDelete(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Cloud className="w-4 h-4 text-sky-600" />
            <span className="font-semibold text-sky-700">Integração Google Drive</span>
            <span aria-hidden="true">&middot;</span>
            <span>Com permissão do usuário</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
            Sincronização e Backup no Google Drive
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-0.5">
            Salve suas pontuações e estrelas com segurança no seu Google Drive, exporte relatórios pedagógicos para os professores e restaure seu progresso em qualquer dispositivo.
          </p>
        </div>

        {/* User Account / Auth Status */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 p-1.5 pl-3 pr-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="text-slate-700 font-medium truncate max-w-[160px]">
                {currentUser.displayName || currentUser.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                title="Desconectar do Google"
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              disabled={isSigningIn}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>{isSigningIn ? 'Conectando...' : 'Conectar com Google Drive'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : feedback.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-sky-50 border-sky-300 text-sky-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : feedback.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-sky-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Action Bar (when connected) */}
      {currentUser && accessToken ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="md:col-span-5 space-y-1.5">
              <label htmlFor="student-name" className="block text-xs font-semibold text-slate-800">
                Nome do Aluno(a) (opcional para o relatório)
              </label>
              <input
                id="student-name"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ex: Maria Clara Silva"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="md:col-span-7 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleSaveBackup}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Salvar Progresso no Drive</span>
              </button>

              <button
                type="button"
                onClick={handleSaveReport}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Exportar Relatório (HTML/PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => fetchFiles()}
                disabled={isLoading}
                title="Atualizar lista de arquivos"
                className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Drive Files List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <FolderCheck className="w-4 h-4 text-sky-600" />
                <span>Arquivos salvos no Google Drive ({files.length})</span>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Pasta: Trilha da Reta Numerica</span>
            </div>

            {isLoading && files.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-slate-200 rounded-xl bg-slate-50">
                Carregando arquivos do Google Drive...
              </div>
            ) : files.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-300 rounded-xl bg-slate-50 space-y-1">
                <p className="font-semibold text-slate-700">Nenhum backup ou relatório encontrado ainda.</p>
                <p>Clique em &quot;Salvar Progresso no Drive&quot; para criar seu primeiro ponto de restauração na nuvem.</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {files.map((file) => {
                  const isBackup = file.name.includes('progresso_reta');
                  const isReport = file.name.includes('Relatorio_Desempenho');
                  const dateStr = file.modifiedTime ? new Date(file.modifiedTime).toLocaleString('pt-BR') : '';

                  return (
                    <div
                      key={file.id}
                      className="p-3.5 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isBackup
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : isReport
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isBackup ? <Cloud className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{file.name}</div>
                          <div className="text-slate-500 text-[11px] font-mono-num">
                            {isBackup ? 'Backup de Progresso (JSON)' : isReport ? 'Relatório Pedagógico (HTML)' : 'Arquivo'} &middot; {dateStr}
                          </div>
                        </div>
                      </div>

                      {/* File Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            title="Abrir no Google Drive"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        {isBackup && (
                          <button
                            type="button"
                            onClick={() => setFileToRestore(file)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-md text-xs font-medium transition-colors cursor-pointer"
                            title="Restaurar este progresso no jogo"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Restaurar</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setFileToDelete(file)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Excluir arquivo do Google Drive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Logged Out Explanation Banner */
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-3">
          <div className="font-semibold text-slate-900 text-sm">
            Por que conectar seu Google Drive?
          </div>
          <ul className="space-y-1.5 list-disc list-inside">
            <li><strong>Armazenamento Seguro:</strong> Salve seus pontos, estrelas e níveis alcançados na nuvem do Google.</li>
            <li><strong>Portabilidade:</strong> Continue o jogo em outro computador, tablet ou celular restaurando seu backup.</li>
            <li><strong>Relatórios Escolares:</strong> Exporte arquivos de desempenho prontos para envio a professores ou responsáveis.</li>
            <li><strong>Privacidade:</strong> O aplicativo só acessa os arquivos com permissão explícita do usuário.</li>
          </ul>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleLogin}
              disabled={isSigningIn}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              <Cloud className="w-4 h-4" />
              <span>Conectar Google Drive Agora</span>
            </button>
          </div>
        </div>
      )}

      {/* Explicit Confirmation Modal for Destructive Deletion */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Confirmar Exclusão de Arquivo
                </h3>
                <p className="text-xs text-slate-600">
                  Tem certeza de que deseja excluir permanentemente o arquivo{' '}
                  <strong className="text-slate-900 font-mono break-all">&quot;{fileToDelete.name}&quot;</strong> do seu Google Drive? Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
              >
                {isDeleting ? 'Excluindo...' : 'Confirmar e Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explicit Confirmation Modal for Restoring Progress */}
      {fileToRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Restaurar Progresso do Jogo
                </h3>
                <p className="text-xs text-slate-600">
                  Deseja substituir o progresso atual do jogo pelos dados salvos no arquivo{' '}
                  <strong className="text-slate-900 font-mono break-all">&quot;{fileToRestore.name}&quot;</strong>?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFileToRestore(null)}
                disabled={isRestoring}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeRestore}
                disabled={isRestoring}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
              >
                {isRestoring ? 'Restaurando...' : 'Confirmar e Restaurar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
