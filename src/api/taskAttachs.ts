import settings from '../store/settings';
import baseFetch from './baseFetch';
import { ITaskAttach } from '../types';

const ENDPOINT = `${settings.SERVER}/taskAttachments`;

const getFiles = async (taskId: string) => baseFetch<ITaskAttach[]>(`${ENDPOINT}/?taskId=${taskId}`, 'GET');

const uploadFile = async (file: FormData) => baseFetch<string>(`${ENDPOINT}/`, 'POST', file);

const deleteFile = async (id: string) => baseFetch<ITaskAttach>(`${ENDPOINT}/${id}`, 'DELETE');

const files = {
  getFiles,
  upload: uploadFile,
  delete: deleteFile,
};

export default files;
