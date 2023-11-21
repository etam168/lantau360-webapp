import { ref } from "vue";
import { FetchStatus } from "@/constants";
import { Content } from "@/interfaces/content";

import api from "@/api/crud";

export default function useContent() {
  const status = ref(FetchStatus.IDLE);

  async function createUpdateContent(data: any, name: string) {
    try {
      const url = `/Content/CreateOrUpdateContent/${name}`;
      await api.update(url, data);
    } catch (err) {
      status.value = FetchStatus.ERROR;
      throw new Error(err);
    }
  }

  async function getContentByName(name: string) {
    try {
      const { data } = await api.get(`/Content/ContentByName/${name}`);
      await new Promise(resolve => setTimeout(resolve, 300));

      return data;
    } catch (err) {
      status.value = FetchStatus.ERROR;
      throw { message: err.message, status: err.response.status };
    }
  }

  function getMeta(content: Content) {
    // Ensure content.value.meta is an object and not null
    const empty = {} as Record<string, unknown>;
    const meta = typeof content.meta == "object" ? content.meta ?? empty : empty;

    return meta;
  }

  return {
    status,

    createUpdateContent,
    getContentByName,
    getMeta
  };
}
