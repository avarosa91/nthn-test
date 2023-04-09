<template>
  <b-modal
    :id="`game-modal-${id}`"
    ref="editor"
    :size="modalSize"
    modal-header-close
    no-close-on-backdrop
    header-close-content="&times;"
    hide-footer
  >
    <template #modal-header>
      <div class="header">
        <div class="logo">
          <img :src="mainLogo.file.url" alt="logo" />
        </div>
        <div class="legal-img">
          <NuxtLink to="/responsabile"
            ><img class="adult" :src="adult.file.url" alt="adult"
          /></NuxtLink>
          <NuxtLink to="/responsabile"
            ><img class="adm" :src="adm.file.url" alt="adm"
          /></NuxtLink>
        </div>
        <div class="close">
          <b-button @click="clickClose">{{ `&times;` }}</b-button>
        </div>
      </div>
    </template>
    <div v-if="buttonsShow" class="buttons">
      <MainButton button-text="Soldi veri" @onClick="clickLogin" />
      <MainButton
        button-text="Soldi finti"
        button-color="dark-orange"
        @onClick="clickDemo"
      />
    </div>
    <IframeGame
      v-if="iframeShow"
      :id="id"
      :url="`https://download.wmgaming.it:8443/pages/HTML5/Giochi24/SKINS/${gameLinkTitle}/index.html`"
    />
    <AuthorizationBlock v-if="authorizationShow" />
  </b-modal>
</template>

<script>
import { mapState } from "vuex";
import IframeGame from "@/components/GamesComponents/IframeGame.vue";
import AuthorizationBlock from "@/components/GamesComponents/AuthorizationBlock";

export default {
  name: "GameModal",
  components: {
    AuthorizationBlock,
    IframeGame,
  },
  props: {
    id: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      buttonsShow: true,
      modalSize: "md",
      iframeShow: false,
      authorizationShow: false,
    };
  },
  computed: {
    ...mapState("siteData", ["data"]),
    adm() {
      return this.data ? this.data?.adm?.fields : null;
    },
    adult() {
      return this.data ? this.data?.adult?.fields : null;
    },
    mainLogo() {
      return this.data ? this.data?.mainLogo?.fields : null;
    },
    gameLinkTitle() {
      return this.id.replaceAll("-", "");
    },
  },
  methods: {
    clickClose() {
      this.$bvModal.hide(`game-modal-${this.id}`);
      this.buttonsShow = true;
      this.iframeShow = false;
      this.authorizationShow = false;
      this.modalSize = "md";
    },
    clickDemo() {
      this.buttonsShow = false;
      this.iframeShow = true;
      this.modalSize = "xl";
    },
    clickLogin() {
      this.buttonsShow = false;
      this.authorizationShow = true;
      this.modalSize = "lg";
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .modal-header {
  padding: 5px;
  background-color: $orange;
}
::v-deep .modal-body {
  background: $gray-200;
}
.header {
  width: 100%;
  display: flex;
  .logo {
    flex-grow: 3;
    img {
      height: 50px;
    }
  }
  .legal-img {
    margin-right: 10px;
    align-self: center;
    .adm {
      margin-left: 10px;
      height: 30px;
    }
  }
  img {
    height: 40px;
  }
  .close {
    ::v-deep .btn {
      background: none;
      border: none;
      color: $white;
      font-size: 25px;
      font-weight: bold;
    }
  }
}
.buttons {
  display: flex;
  margin: 30px auto;
  width: 54%;
  ::v-deep .main-button {
    margin-right: 15px;
    margin-left: 15px;
  }
}
</style>
