export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
}

export interface DriveProgressSaveData {
  savedAt: string;
  appName: string;
  appletId: string;
  studentName?: string;
  totalScore: number;
  totalStars: number;
  completedCount: number;
  progressMap: Record<
    number,
    {
      levelId: number;
      completed: boolean;
      stars: number;
      bestScore: number;
      attempts: number;
    }
  >;
}

const APP_FOLDER_NAME = 'Trilha da Reta Numerica';
const BACKUP_FILENAME_PREFIX = 'progresso_reta_numerica';

/**
 * Lists files in user's Google Drive matching a query
 */
export async function listDriveFiles(
  accessToken: string,
  query?: string,
  pageSize = 20
): Promise<DriveFileItem[]> {
  const params = new URLSearchParams({
    pageSize: pageSize.toString(),
    fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink)',
    orderBy: 'modifiedTime desc',
  });

  if (query) {
    params.set('q', query);
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ao listar arquivos do Google Drive (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Searches or creates a designated application folder in Google Drive
 */
export async function getOrCreateAppFolder(accessToken: string): Promise<string> {
  const query = `name = '${APP_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const existingFolders = await listDriveFiles(accessToken, query, 1);

  if (existingFolders.length > 0) {
    return existingFolders[0].id;
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: APP_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Pasta criada pelo jogo Trilha da Reta Numérica para backups e relatórios dos alunos',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao criar pasta no Google Drive: ${errorText}`);
  }

  const created = await response.json();
  return created.id;
}

/**
 * Saves progress backup as a JSON file in Google Drive inside the app folder
 */
export async function saveProgressToDrive(
  accessToken: string,
  saveData: DriveProgressSaveData
): Promise<DriveFileItem> {
  const folderId = await getOrCreateAppFolder(accessToken);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${BACKUP_FILENAME_PREFIX}_${timestamp}.json`;

  const metadata = {
    name: filename,
    mimeType: 'application/json',
    parents: [folderId],
    description: `Backup do progresso escolar - ${saveData.totalScore} pts e ${saveData.totalStars} estrelas`,
  };

  const fileContent = JSON.stringify(saveData, null, 2);

  // Use multipart upload to upload metadata + content in one request
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao enviar arquivo para o Google Drive: ${errorText}`);
  }

  return await response.json();
}

/**
 * Saves an educational PDF / HTML report sheet to Google Drive
 */
export async function saveReportToDrive(
  accessToken: string,
  studentName: string,
  reportHtmlContent: string
): Promise<DriveFileItem> {
  const folderId = await getOrCreateAppFolder(accessToken);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const cleanStudent = studentName.trim() ? studentName.trim().replace(/\s+/g, '_') : 'Aluno';
  const filename = `Relatorio_Desempenho_${cleanStudent}_${timestamp}.html`;

  const metadata = {
    name: filename,
    mimeType: 'text/html',
    parents: [folderId],
    description: `Relatório escolar de matemática - Reta Numérica para ${studentName || 'Aluno'}`,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
    reportHtmlContent +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao salvar relatório no Google Drive: ${errorText}`);
  }

  return await response.json();
}

/**
 * Loads a progress backup file content from Google Drive
 */
export async function loadProgressFromDrive(
  accessToken: string,
  fileId: string
): Promise<DriveProgressSaveData> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao baixar arquivo do Google Drive: ${errorText}`);
  }

  return await response.json();
}

/**
 * Permanently deletes or trashes a file from Google Drive (Requires user confirmation before invoking)
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    const errorText = await response.text();
    throw new Error(`Erro ao excluir arquivo do Google Drive: ${errorText}`);
  }
}
