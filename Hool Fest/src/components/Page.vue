<template>
  <div>
    <header class="poster">
      <h1 class="title">Hool</h1>
      <h2 class="tag-line" 
        :class="{ active: about }"
        @click="toggleAbout">
        Digital Art Festival
      </h2>
      
      <h2 class="cta" 
        :class="{ active: signUp }"
        @click="toggleSignUp">
          Keep Updated
      </h2>
     
      <section class="about" :class="{ active: about }""  @click="toggleAbout">
        <h2>What?</h2>
        <p>Hool is an online interactive art festival.</p>
        <p>Explore, socialise and interact with a curated selection of code art, VR sculpture, 3D design and animation.</p>
        <p>Come and experience an alternative art event like never before.</p>
      </section>
      
      <!-- <section class="sign-up" :class="{ active: signUp }">
        <p>Sign up to our mailing list to be in the know...</p>
        <input type="text" placeholder="name"  
          autocomplete="off"
          v-model="name">
        <input type="email" placeholder="email"  autocomplete="off"
          v-model="email">
        <div class="sign" @click="saveName"><p>Sign Up ></p></div>
      </section> -->

      <!-- <mailchimp-form :class="{ active: signUp }"/> -->

    </header>

    <div id="page">
       <poster/>
    </div>
  </div>
</template>

<script>
import Poster from '@/components/Poster.vue';
import MailchimpForm from '@/components/MailchimpForm.vue';

export default {
  name: 'Page',
  components: {
    Poster,
    MailchimpForm,
  },
  data: function(){
    return{
      about : false,
      signUp : false,
      count : 0,
      name: '',
      email: '',
      names : [],
    }
  },
  methods: {
    toggleAbout() {
      this.about = !this.about;
      this.signUp = false; 
    },
    toggleSignUp() {
      this.signUp = !this.signUp;
      this.about = false; 
    },
    addNames(){
      // add input to this.names
    },
    saveName() {
      this.count += 1;
      console.log(this.count);
      // Add to array
      this.names.push({name: this.name, email: this.email});
      this.name = '';
      this.email = '';

      // Save
      let data = JSON.stringify(this.names);
      window.localStorage.setItem('hool-list-' + this.count, data);
      console.log(JSON.parse(window.localStorage.getItem('hool-list-'+ this.count)));
    }
  }
}
</script>

<style scoped>
#page {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body{
  margin: 0px;
  position: fixed;
}

a{
  color: white;
  text-decoration: none;
}

.poster{
  position: fixed;
  width: 100%;
  height: 100%;
}

.poster .title{
  margin: 0px;
  position: absolute;
  right: 1.25em;
  top: 0.75em;
  text-align: right;
  color: white;
}

.poster .tag-line{
  cursor: pointer;
  color: white;
  font-size: 1.0em;
  font-weight: 400;
  position: absolute;
  text-align: left;
  transform: rotate(90deg);
  transform-origin: 0% 0%;
  left: 3em;
  top: 0em;
  opacity: 1;
  transition: left 0.5s, opacity 0.25s;
}

.tag-line.active{
  opacity: 0.0;
  left: calc( 3em + 250px);
}

.poster .tag-line::before{
   cursor: pointer;
  content: "+";
  font-size: 2em;
  font-weight: 900;
  vertical-align: middle;
  padding: 0.5em;

}

.poster .cta::after{
  content: ">";
  font-size: 2em;
  font-weight: 900;
  vertical-align: middle;
  padding: 0.5em;

}

.poster .cta{
   cursor: pointer;
      color: white;
    font-size: 1.0em;
    font-weight: 400;
    position: absolute;
    transform-origin: 100% 100%;
    transform: rotate(90deg);
    right: 4em;
    bottom: 0em; 
    transition: bottom 0.5s, opacity 0.25s;
}

.cta.active{
  opacity: 0.0;
  bottom: calc( 50vh );
}

    
section.sign-up {
    width: 50%;
    text-align: left;
    color: white;
    max-width: 250px;
    padding: 1.5em 2em;
    bottom: -50vh;
    opacity: 0.0;
    right: 0px;
    position: absolute;
    -webkit-transition: left 0.5s, opacity 0.5s;
    transition: bottom 0.5s, opacity 0.5s;
}

section.sign-up.active{
  bottom: 1em;
  opacity: 1.0;
}

section.about {
    width: 50%;
    text-align: left;
    color: white;
    max-width: 19em;
    text-align: justify;
    padding: 0em 2em;
    position: absolute;
    left: -500px;
    top: 2em;
    opacity: 0.0;
    -webkit-transition: left 0.5s, opacity 0.5s;
    transition: left 0.5s, opacity 0.5s;
}

section.about.active{
  left: 0px;
  opacity: 1.0;
}


input[type="text"],
input[type="email"] {
    background: none;
    margin: 0.5em 0px;
    /* max-width: 80%; */
    border: 2px solid white;
    color: white;
    padding: 0.5em;
    font-size: 1em;

}

input[type="text"]::placeholder,
input[type="email"]::placeholder {
    color: white;
    opacity: 1.0;
}

.sign p {
    cursor: pointer;
    display: block;
    background: none;
    border: none;
    color: white;
    font-size: 2em;
    font-weight: 900;
    margin: 1em 0px;
    font-family: 'Chakra Petch', sans-serif;
}

/* Header */
/*header{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    position: fixed;
    width: 100%;
    opacity: 1.0;
    transition: opacity 0.2s;
}

header:hover {
  opacity: 1.0;
}

header h1 {
  margin: auto 1em;
}

header nav {
  margin: auto 1em;
}

header li {
  display: inline-block;
  margin: auto 0.5em;
}

header li a {
  font-weight: 200;
}
header li a:hover {
  font-weight: 800;
}*/

</style>
