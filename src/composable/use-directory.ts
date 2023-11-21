import { ref } from "vue";
import { FetchStatus } from "@/constants";

import api from "@/api/crud";

export default function useDirectory() {
  const status = ref(FetchStatus.IDLE);
  const directories = ref(fetchDirectories());

  async function getDataTable(params: any) {
    try {
      const { data } = await api.get("/Directory/Datatable", params);

      return data || [];
    } catch (err) {
      status.value = FetchStatus.ERROR;

      throw new Error(err);
    }
  }

  async function createDirectory(params: any) {
    try {
      const { data } = await api.get("/Directory/Datatable", params);

      return data || [];
    } catch (err) {
      status.value = FetchStatus.ERROR;

      throw new Error(err);
    }
  }

  async function fetchDirectories() {
    status.value = FetchStatus.RUNNING;
    try {
      const response = await api.get("/Directory/Datatable");

      status.value = FetchStatus.SUCCESS;
      return response.data;
    } catch (err) {
      status.value = FetchStatus.ERROR;

      throw new Error(err);
    }
  }

  async function refetchDirectories() {
    directories.value = await fetchDirectories();
  }

  async function getDirectories() {
    try {
      const response = await api.get("/Directory");
      await new Promise(resolve => setTimeout(resolve, 300));

      return response.data;
    } catch (err) {
      status.value = FetchStatus.ERROR;

      throw new Error(err);
    }
  }

  async function getDirectoriesListByGroupId(groupId: number) {
    let response = null;
    await api
      .get(`/Directory/DirectoryGroupsData/${groupId}`)
      .then(({ data }) => {
        response = data;
      })
      .catch(error => {
        throw new Error(error);
      });
    return response;
  }

  return {
    directories,
    status,
    getDirectoriesListByGroupId,

    createDirectory,
    getDataTable,
    getDirectories,
    refetchDirectories
  };
}
