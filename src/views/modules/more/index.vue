<template>
  <q-page>
    <app-page-title :title="$t(`${i18nKey}.title`)"></app-page-title>

    <pre>{{ isLoading }}</pre>

    <q-card-section class="q-gutter-md">
      <template v-for="(item, index) in renderItems" :key="index">
        <more-page-logoff v-if="item.type === 'logoff'" @on-dialog="throttledHandleLoginDialog" />
        <more-page-logon v-if="item.type === 'logon'" @on-dialog="throttledHandleLoginDialog" />

        <more-page-item
          v-if="['moreItem', 'language'].includes(item.type)"
          :ref="el => setItemRef(item.name, el)"
          :type="item.type"
          :icon="item.icon!"
          :title="item.title"
          @on-item-click="onItemClick(item)"
        />
      </template>
    </q-card-section>

    <more-page-footer />
  </q-page>
</template>

<script setup lang="ts">
  import { throttle } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { EntityURLKey, ICONS } from "@/constants";
  import MorePageItem from "@/components/global/custom/more-page-item.vue";
  import { Member } from "@/interfaces/models/entities/member";

  const $q = useQuasar();
  const userStore = useUserStore();
  const { eventBus } = useUtilities();
  const { fetchTransactionData } = useTransactionsFunctions();
  const { handleOpenDialog } = useEntityDataHandlingService();

  const throttledHandleLoginDialog = throttle(showLoginDialog, 2000);

  const { openMemberItemDialog } = useMemberItemDialogService();

  const i18nKey = "more";
  const isDialogOpen = ref(false);
  const lookUpEntityTypes = ["MEMBER"];

  interface RenderItem {
    name: string;
    icon?: string;
    title?: string;
    type: "language" | "logoff" | "logon" | "moreItem";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (userStore.isUserLogon()) {
      case true:
        return [
          { name: "logoff", type: "logoff" },
          { name: "language", icon: ICONS.SETTING, type: "language", title: `${i18nKey}.language` },
          { name: "terms", type: "moreItem", icon: ICONS.TNC, title: `${i18nKey}.terms` },
          { name: "privacy", type: "moreItem", icon: ICONS.PRIVACY, title: `${i18nKey}.privacy` },
          { name: "profile", type: "moreItem", icon: ICONS.PROFILE, title: `${i18nKey}.profile` },
          { name: "account", type: "moreItem", icon: ICONS.ACCOUNT, title: `${i18nKey}.account` },
          { name: "checkIn", type: "moreItem", icon: ICONS.PRIVACY, title: `${i18nKey}.checkin` }
        ];

      default:
        return [
          { name: "logon", type: "logon" },
          { name: "language", icon: ICONS.SETTING, type: "language", title: `${i18nKey}.language` },
          { name: "privacy", type: "moreItem", icon: ICONS.PRIVACY, title: `${i18nKey}.privacy` },
          { name: "terms", type: "moreItem", icon: ICONS.TNC, title: `${i18nKey}.terms` }
        ];
    }
  });

  // const itemRefs = ref<{ [key: string]: ComponentPublicInstance | null }>({});
  const childComponent = ref<InstanceType<typeof MorePageItem> | null>(null);

  function handleInstall() {
    alert("handleInstall");
  }

  const onItemClick = (item: any) => {
    const { name } = item;
    let component;
    let props;
    let entityKey;

    switch (name) {
      case "profile":
        entityKey = "MEMBER" as EntityURLKey;
        props = { category: item, entityKey: entityKey };
        component = defineAsyncComponent(
          () => import("@/components/dialog/generic-gallery-input-dialog/index.vue")
        );
        handleOpenDialog(
          undefined,
          component,
          component,
          props,
          isDialogOpen.value,
          lookUpEntityTypes,
          entityKey
        );
        break;

      case "privacy":
      case "terms":
        handleMoreDialog(name);
        break;

      case "account":
      case "checkIn":
        alert(name.toUpperCase());
        if (isDialogOpen.value) return;
        openMemberItemDialog(
          isDialogOpen,
          { memberId: userStore.userId } as Member,
          name.toUpperCase()
        );
        resetItemLoading(name);
        break;
      default:
        break;
    }
  };

  const isLoading = ref(false);

  // function handleMoreDialog(name: string) {
  //   isLoading.value = true;

  //   $q.dialog({
  //     component: defineAsyncComponent(
  //       () => import("@/components/dialog/more-detail-dialog/index.vue")
  //     ),
  //     componentProps: {
  //       contentName: name,
  //       isLoading: isLoading
  //     }
  //   });
  // }

  const itemRefs = ref<{ [key: string]: any }>({});

  const setItemRef = (name: string, el: any) => {
    if (el) {
      itemRefs.value[name] = el;
    }
  };

  function handleMoreDialog(name: string) {
    isLoading.value = true;

    // Introduce a delay of 1000 milliseconds (1 second)

    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/more-detail-dialog/index.vue")
      ),
      componentProps: {
        contentName: name,
        isLoading: isLoading
      }
    })
      .onCancel(() => {
        alert("oncancel");
        isLoading.value = false;
        resetItemLoading(name);
      })
      .onOk(() => {
        // alert("OnOk");
        resetItemLoading(name);
      });
  }

  function resetItemLoading(name: string) {
    const item = itemRefs.value[name];
    if (item && typeof item.resetLoading === "function") {
      item.resetLoading();
    }
  }

  function showLoginDialog(tabValue: string) {
    alert("YES");
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
      componentProps: {
        tabValue: tabValue,
        callback: fetchTransactionData
      }
    });
  }

  onMounted(() => {
    $q.notify({
      message: "Install App",
      color: "primary",
      actions: [
        {
          label: "Install",
          color: "white",
          handler: () => {
            handleInstall();
          }
        }
      ]
    });

    eventBus.on("refresh-transaction-data", () => {
      fetchTransactionData();
    });
  });

  fetchTransactionData();
</script>
