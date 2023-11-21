<template>
  <q-card flat>
    <q-scroll-area style="height: calc(100vh - 258px)" class="q-ma-none q-pr-lg">
      <q-card-section class="q-pa-none">
        <app-card-title>Listing Image</app-card-title>
        <q-item class="q-pa-none">
          <q-item-section avatar>
            <q-avatar class="bg-grey" size="64px" rounded>
              <q-img :src="postingInput.iconPath" />
            </q-avatar>
          </q-item-section>

          <q-item-section top>
            <q-file
              ref="iconRef"
              v-show="false"
              v-model="iconPath"
              @update:model-value="uploadIconPath"
            />

            <q-item-label>Max. Size:</q-item-label>
            <q-item-label caption> 300 x 300 px </q-item-label>
            <q-item-label>
              <q-btn
                round
                size="sm"
                color="green"
                icon="photo_camera"
                @click="onUploadImage(iconRef)"
              ></q-btn>
              <q-btn
                round
                size="sm"
                color="red"
                icon="delete"
                :disable="postingInput.iconPath == null"
                @click="handleDelete(2)"
                class="q-ml-sm"
              ></q-btn
            ></q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator spaced="16px" size="0.5px" color="green" />

      <q-card-section class="q-pa-none">
        <app-card-title>Content Page Image</app-card-title>
        <q-card style="width: 290px" flat bordered>
          <q-img fit="cover" position="top" :ratio="16 / 9" :src="postingInput.imagePath" />

          <q-separator color="dark-grey" />
          <q-card-actions align="left">
            <div>*Aspect Ratio 16:9</div>
            <q-file
              ref="imageRef"
              v-show="false"
              v-model="imagePath"
              @update:model-value="uploadImagePath()"
            />
            <q-space />
            <q-btn
              flat
              round
              icon="delete"
              color="red"
              v-show="method == 'edit'"
              :disable="postingInput.imagePath == null"
              @click="handleDelete(3)"
            />
            <q-btn
              flat
              round
              color="green"
              icon="photo_camera"
              @click="onUploadImage(imageRef)"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-card-section>
      <q-separator spaced="16px" size="0.5px" color="green" />

      <q-card-section class="q-pa-none">
        <app-card-title>Promotion Image (Optional)</app-card-title>
        <q-card style="width: 290px" flat bordered>
          <q-img fit="cover" position="top" :ratio="16 / 9" :src="postingInput.bannerPath"> </q-img>

          <q-separator color="dark-grey" />
          <q-card-actions align="left">
            <div>*Aspect Ratio 16:9</div>
            <q-file
              ref="bannerRef"
              v-show="false"
              v-model="bannerPath"
              @update:model-value="uploadbannerPath"
            />
            <q-space />
            <q-btn
              flat
              round
              icon="delete"
              color="red"
              v-show="method == 'edit'"
              :disable="postingInput.bannerPath == null"
              @click="handleDelete(1)"
            />
            <q-btn
              flat
              round
              color="green"
              icon="photo_camera"
              @click="onUploadImage(bannerRef)"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-card-section>
    </q-scroll-area>
    <q-card-actions class="q-mt-md">
      <app-button color="green" :label="$t('action.save')" @click="onBtnSaveClick"></app-button>
      <app-button flat color="primary" @click="handleBack" :label="$t('action.back')" />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent } from "vue";

  // .ts files
  import usePostingInput from "../use-posting-input";

  export default defineComponent({
    name: "InputDialogStep4",

    components: {
      AppButton: defineAsyncComponent(() => import("@/components/widgets/app-button.vue")),
      AppCardTitle: defineAsyncComponent(() => import("@/components/widgets/app-card-title.vue"))
    },
    props: {
      method: {
        type: String
      }
    },

    setup(_, { emit }) {
      const {
        imagePath,
        bannerPath,
        iconPath,
        postingInput,
        iconRef,
        imageRef,
        bannerRef,
        uploadImagePath,
        uploadbannerPath,
        uploadIconPath
      } = usePostingInput();

      function onUploadImage(imageRef: any) {
        imageRef.pickFiles();
      }

      function handleBack() {
        emit("move-back", postingInput.value);
      }

      function handleDelete(ranking: any) {
        emit("delete-image", ranking);
      }

      function onBtnSaveClick() {
        postingInput.value.bannerPath = bannerPath.value;
        postingInput.value.imagePath = imagePath.value;
        postingInput.value.iconPath = iconPath.value;
        emit("move-next");
      }

      return {
        bannerPath,
        iconPath,
        imagePath,

        bannerRef,
        iconRef,
        imageRef,

        postingInput,
        onUploadImage,

        uploadbannerPath,
        uploadIconPath,
        uploadImagePath,
        handleBack,
        handleDelete,
        onBtnSaveClick
      };
    }
  });
</script>
