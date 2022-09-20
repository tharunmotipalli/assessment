<template>
<div>
    <v-text-field v-model="searchInput"  @keydown="searchFunction" placeholder="search bar">search</v-text-field>
</div>

</template>
<script>
export default{
    name:'SearchBar',
    data(){
        return{
        searchInput:'',
        }
    },
    methods:{
        searchFunction(){
            this.$emit('searcher',this.searchInput)
        }

    }
}


</script>