import { defineStore } from "pinia";

export const useAuthenticationStore = defineStore("authenticate", {
    state: () => {
        return { isAuthenticated: false, isSuperuser: false, nickname: '' }
    },
    actions: {
        login(isStaff: boolean, nickname: string) {
            this.isAuthenticated = true
            this.nickname = nickname

            if (isStaff) {
                this.isSuperuser = true
            }
        },
        logout() {
            this.isAuthenticated = false
            this.nickname = ''

            if (this.isSuperuser) {
                this.isSuperuser = false
            }
        }
    },
    getters: {

    }
})