<script lang="ts">
import { Roles } from '@/common/roles';
import AuthService from '@/services/auth-service';
import { storeService } from '@/store';
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      isAdmin: false,
      isStudent: false,
      isSupervisor: false,
      fullName: "",
      avatarURL: "https://ui-avatars.com/api/?name="
    };
  },
  methods: {
    setProperties: function () {
      const role = AuthService.getRole();
      if (role !== null) {
        let parsedToken = storeService.user.getUser();

        if (null === parsedToken) {
          parsedToken = AuthService.parseToken(AuthService.getAccessToken());
        }
        
        if (parsedToken !== null && typeof parsedToken.username !== 'undefined') {
          storeService.user.load(parsedToken);
          this.fullName = parsedToken.fullName;
          const processedFullName = this.fullName.includes(" ") ? this.fullName.replace(" ", "+") : this.fullName;
          this.avatarURL = this.avatarURL + processedFullName;
        }
        switch (role) {
          case Roles.ROLE_ADMIN:
            this.isAdmin = true;
            break;
          case Roles.ROLE_STUDENT:
            this.isStudent = true;
            break;
          default:
            this.isSupervisor = true;
        }
      } else {
        this.isAdmin = false;
        this.isStudent = false;
        this.isSupervisor = false;
      }

    }
  },
});
</script>