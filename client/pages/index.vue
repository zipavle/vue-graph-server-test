<template>
    <div>
        <div v-if="$store.state.user === null">
            <h2>Login</h2>
            <form v-on:submit.prevent="login">
                <label for="login-username">username<input type="text" v-model="input.username" id="login-username"></label>
                <label for="login-password">password<input type="text" v-model="input.password" id="login-password"></label>
                <button type="submit">login</button>
            </form>
            <h2>Register</h2>
            <form v-on:submit.prevent="register">
                <label for="register-name">name<input type="text" v-model="input.name" id="register-name"></label>
                <label for="register-email">email<input type="email" v-model="input.email" id="register-email"></label>
                <label for="register-username">username<input type="text" v-model="input.username" id="register-username"></label>
                <label for="register-password">password<input type="text" v-model="input.password" id="register-password"></label>
                <button type="submit">register</button>
            </form>
        </div>
        <div v-else>
            <h2>Hello {{$store.state.user.name}}</h2>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag';
export default {
  data() {
      return {
        msg: 'hello',
          input: {
              username: 'test',
              password: 'test',
              name: 'test testič',
              email: 'test@test.test'
          },
        posts: []
      }
  },
    /*
  apollo: {
      posts: gql`{
          posts {
              title
          }
      }`
  },
  */
  methods: {
      login() {
          this.$store.dispatch('login', {username: this.input.username, password: this.input.password});
      },
      register() {
          this.$store.dispatch('register', {name: this.input.name, email: this.input.email, username: this.input.username, password: this.input.password});
      }
  }
}
</script>
