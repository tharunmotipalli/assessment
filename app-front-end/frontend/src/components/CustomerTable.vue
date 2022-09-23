<template>
    <div>
        <v-app>
        <SearchBar @searcher="changedInput($event)"></SearchBar>
      <v-simple-table >
        <thead>
          <tr>
            <th class="text-left">customer Id<v-icon  @click="sort('customerid')" small >
                {{icon}}
               </v-icon>
             </th>
            <th class="text-left">Customer Name<v-icon @click="sort('customername')" small >
                 {{icon}}
              </v-icon>
            </th>
            <th class="text-left">No of Hotels
         </th>
            
            <th class="text-left">Edit</th>
            <th class="text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-left" v-for="item in list" v-bind:key="item.id">
            
             <td>{{ item.customerid }}</td>
             <td>{{ item.customername}}
            </td>
            <td>{{ item.count}}</td>
           
                <td>
                    <v-icon  color="red" @click="editItem(item)" small class="mr-2">
                      mdi-pencil
                    </v-icon>
                </td>
                <td>
                    <v-icon color="green" class="mr-2" @click="deleteItem(item)" small>
                      mdi-delete
                    </v-icon>
                </td>
            
          </tr>
        </tbody>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Table Details</v-toolbar-title>
            <v-divider inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog  v-model="dialog" max-width="1000px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="red" dark v-bind="attrs" @click="popup" v-on="on">
                  +
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  <v-container>
                    <v-form ref="form">
                        <v-text-field label="customerid" v-model="formData.customerid" type="text" :rules="[
                            v =>!!v || 'customerid is Required',
            
                          ]"></v-text-field>
                      <v-text-field label="customer name" v-model='formData.customername' placeholder="enter  customer name" :rules="[
                        v => !!v || ' Customer Name is required',
                                              
                      ]"></v-text-field>
                    
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red" @click="cancel" text>
                    Cancel
                  </v-btn>
                  <v-btn color="red" v-model="saveButton" @click='insert' v-if="rand">
                    Save
                  </v-btn>
                  <v-btn color="red" v-model="editButton" @click='edit(list.id)' v-if="!rand">
                    edit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
      </v-simple-table>
    </v-app>
    </div>
  </template>
  <script>
import API from "../services/api"
  export default {
    name: 'CustomerTable',
  
    data() {
      return {
        list: [],
        dialog: false,
        tempObj: {},
        editedIndex: -1,
        formData: {
         id: '',
         customername:'',
         customerid:''
        },
        saveButton: true,
        editButton: false,
        key: 0,
        rand: true,
        searchitem: undefined,
        searchInput:'',
        option:'',
        icon:'mdi-arrow-up',
  
      }
    },
    mounted() {
      this.getdata()
     
    },
    methods:
    {
      async getdata() {
        await API.get(`http://127.0.0.1:3333/customers/read`)
          .then((response) => {
            console.warn(response.data)
            this.list = (response.data)
            
          })
      },
      async insert() {
  
        this.$refs.form.validate()
        await API.post(`http://127.0.0.1:3333/customers/insert`, this.formData
  
        )
          .then((response)=> {
            console.log(response);
  
          })
          .catch(function (error) {
            console.log(error);
          });
        this.$refs.form.reset()
        this.getdata()
        this.dialog = false
  
      },
      cancel() {
        this.dialog = false
      },
      popup() {
        this.rand = true
      },
      async deleteItem(item) {
        this.formData = Object.assign({}, item)
        await API.delete(`http://127.0.0.1:3333/customers/delete/${this.formData.id}`)
          .then(response => {
            console.log(response);
          });
        this.getdata()
      },
      editItem(item) {
        this.rand = false
        this.editedIndex = this.list.indexOf(item)
        this.formData = Object.assign({}, item)
        console.log(this.formData)
        this.dialog = true
        this.saveButton = false
  
      },
  
  
      async edit() {
        await API.put(`http://127.0.0.1:3333/customers/update/${this.formData.id}`,
          this.formData
        )
          .then(response => {
            console.log(response);
          });
        this.$refs.form.reset()
        this.getdata()
        this.dialog = false
  
      },
     
    async changedInput(input){
      console.log(input)
      if(input==''){
          this.getdata()
      }else{
         let searchpromise=await API.post('http://127.0.0.1:3333/customers/search',{value:input})
        this.list=searchpromise.data
      }
    },
      
      sortasc(value){
        API.post(`http://127.0.0.1:3333/customers/sortasc`,{sortItem:value})
        .then((res) => {
              this.list = res.data
        })
        
      },
      sortdesc(value){
        API.post(`http://127.0.0.1:3333/customers/sortdesc`,{sortItem:value})
        .then((res) => {
              this.list = res.data
        })
  },
  sort(value)
  {
    if(this.icon=='mdi-arrow-down'){
      this.icon='mdi-arrow-up'
      this.sortasc(value)
      
    }else if(this.icon=='mdi-arrow-up'){
      this.sortdesc(value)
      this.icon='mdi-arrow-down'
    }
  },

  
  }
  }
  
  </script>