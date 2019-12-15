<template>
    <section class="sign-up">
    
     <p>Sign up to our mailing list to be in the know...</p>
     <form  action="HIDDEN" method="POST">
        <input type="hidden" name="u" value="HIDDEN">
        <input type="hidden" name="id" value="HIDDEN">
        <input type="text" name="MERGE1" placeholder="name"  
          v-model="name">
        <input type="email" name="MERGE0" placeholder="email"  autocomplete="off"
          v-model="email">
        <div class="sign"> 
          <input type="submit" class="formEmailButton" name="submit" value="Sign Up">
        </div>
     </form>


    </section>
</template>

<script>

export default {
  name: 'MailchimpForm',
}

</script>

<style scoped>

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

input[type="submit"] {
    cursor: pointer;
    display: block;
    background: none;
    border: none;
    color: white;
    font-size: 2em;
    font-weight: 900;
    margin: 0.5em 0px;
    font-family: 'Chakra Petch', sans-serif;
}

</style>
