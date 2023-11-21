import { ref } from "vue";
import api from "@/api/crud";
import Axios from "axios";

export const Status = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
};

export default function useMember() {
  const status = ref(Status.IDLE);
  const Member = ref(fetchMember());

  const memberError = ref("");
  const memberLoading = ref(false);
  const memberData = ref(false);

  async function getMemberTable(params: any) {
    try {
      const { data } = await api.get("/Member/Datatable", params);

      return data || [];
    } catch (err) {
      status.value = Status.ERROR;

      throw new Error(err);
    }
  }

  async function getMemberById(id: number) {
    try {
      const { data } = await api.get(`/Member/${id}`);

      return data || [];
    } catch (err) {
      status.value = Status.ERROR;

      throw new Error(err);
    }
  }

  async function createMember(params: any) {
    try {
      const { data } = await api.get("/api/MemberAuth/SingUp", params);
      return data || [];
    } catch (err) {
      status.value = Status.ERROR;

      throw new Error(err);
    }
  }

  async function fetchMember() {
    status.value = Status.RUNNING;
    try {
      const response = await api.get("/Member/Datatable");
      // url: `/Event/Datatable`,
      //

      status.value = Status.SUCCESS;
      return response.data;
    } catch (err) {
      status.value = Status.ERROR;

      throw new Error(err);
    }
  }

  async function refetchMember() {
    Member.value = await fetchMember();
  }

  async function exportMembers() {
    let response;
    await Axios.get("/Member/ExportFile", { responseType: "blob" })
      .then(({ data }) => {
        const url = URL.createObjectURL(
          new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Members List.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        console.log(error);
      });

    return response;
  }

  const getMemberList = async () => {
    let response = null;
    await api
      .get("/Member")
      .then(({ data }) => {
        response = data;
      })
      .catch(error => {
        console.log(error);
      });
    return response;
  };

  return {
    Member,
    status,
    memberLoading,
    memberError,
    memberData,

    createMember,
    getMemberList,
    getMemberTable,
    getMemberById,
    refetchMember,
    exportMembers
  };
}
