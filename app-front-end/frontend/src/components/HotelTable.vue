<template>
  <div>
    <v-app>
      <SearchBar @searcher="changedInput($event)"></SearchBar>
      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left">Hotel Name<v-icon @click="sort('hotelname')" small>
                {{icon}}
              </v-icon>
            </th>
            <th class="text-left"> Customer Id<v-icon @click="sort('customers.customerid')" small>
                {{icon}}
              </v-icon>
            </th>
            <th class="text-left"> address
            </th>
            <th class="text-left">pincode<v-icon @click="sort('pincode')" small>
                {{icon}}
              </v-icon>
            </th>
            <th class="text-left"> Customer Name
            </th>
            <th class="text-left">Edit</th>
            <th class="text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-left" v-for="item in (list)" v-bind:key="item.id">
            <td>{{ item.hotelname}}
            </td>

            <td>{{ item.customerid}}
            </td>
            <td>{{item.address.doorno +' '+item.address.street+' '+item.address.landmark+' '+item.address.city+' '+item.address.pincode}}
            </td>
            <td>{{ item.pincode }}</td>
            <td>{{ item.customername }}</td>
            <td>
              <v-icon color="red" @click="editItem(item)" small class="mr-2">
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
            <v-dialog v-model="dialog" max-width="1000px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="red" dark v-bind="attrs" @click="popup" v-on="on">
                  +
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  <v-container>
                    <v-form ref="form">
                      <v-text-field label="Hotel Name" v-model='formData.hotelname' placeholder="enter  Hotel Name"
                        :rules="[
                          v => !!v || ' Hotel Name is required',     
                        ]"></v-text-field>
                      <v-text-field label="Customer Id" v-model='formData.customerid' placeholder="enter  customerid"
                        :rules="[
                          v => !!v || ' Customer id is required',     
                        ]"></v-text-field>
                      <v-text-field label="Door No" v-model='formData.doorno' placeholder="enter  Door No" :rules="[
                        v => !!v || ' Door No is required',     
                      ]"></v-text-field>
                      <v-text-field label="Street" v-model='formData.street' placeholder="enter  Street" :rules="[
                        v => !!v || ' Street is required',     
                      ]"></v-text-field>
                      <v-text-field label="Land Mark" v-model='formData.landmark' placeholder="enter  Land Mark" :rules="[
                        v => !!v || ' Land Mark is required',     
                      ]"></v-text-field>
                      <v-text-field label="City" v-model='formData.city' placeholder="enter  City" :rules="[
                        v => !!v || ' City is required',     
                      ]"></v-text-field>
                      <v-text-field label="pincode" v-model="formData.pincode" type="text" :rules="[
                        v =>!!v || 'pincode is Required',
        
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
      formData: {
        id: '',
        hotelname: '',
        customerid: '',
        doorno: '',
        street: '',
        landmark: '',
        city: '',
        pincode: ''
      },
      saveButton: true,
      editButton: false,
      key: 0,
      rand: true,
      searchitem: '',
      searchInput: '',
      icon: 'mdi-arrow-up',
      values:{city:'chennai',street:'bazar'},
      address: [],
      appKey: { headers: { appKey: process.env.VUE_APP_KEY} },
      hotelsUrl:process.env.VUE_APP_HOTELS_URL
    }
  },

  mounted() {
    this.getdata()

  },
  methods:
  {
    async getdata() {
      await API.get(`${this.hotelsUrl}/read`, this.appKey)
        .then((response) => {
          console.warn(response)
          this.list = response.data
          console.warn(response.data)
        })
    },
    async insert() {

      this.$refs.form.validate()
      await API.post(`${this.hotelsUrl}/insert`, this.formData, this.appKey
      )
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
      await API.delete(`${this.hotelsUrl}/delete/${this.formData.id}`, this.appKey)
        .then(response => {
          console.log(response);
        });
      this.getdata()
    },
    editItem(item) {
      this.rand = false
      this.editedIndex = this.list.indexOf(item)
      this.formData = Object.assign({}, item)
      this.dialog = true
      this.saveButton = false

    },


    async edit() {
      await API.put(`${this.hotelsUrl}/update/${this.formData.id}`, this.formData, this.appKey)
        .then(response => {
          console.log(response);
        });
      this.$refs.form.reset()
      this.getdata()
      this.dialog = false

    },

    async changedInput(input) { //search
      console.log(input)
      if (!/^\s*\S+.*/.test(input)) {
        this.getdata()
      } else {
        let searchpromise = await API.post(`${this.hotelsUrl}/search`, { value: input }, this.appKey)
        this.list = searchpromise.data
      }

    },
    async sort(value) {
      if (this.icon == 'mdi-arrow-down') {
        this.icon = 'mdi-arrow-up'
        await API.post(`${this.hotelsUrl}/sort`, { sortItem: value, order: 'asc' }, this.appKey)
          .then((res) => {
            this.list = res.data
          })

      } else if (this.icon == 'mdi-arrow-up') {
        await API.post(`${this.hotelsUrl}/sort`, { sortItem: value, order: 'desc' }, this.appKey)
          .then((res) => {
            this.list = res.data
          })
        this.icon = 'mdi-arrow-down'
      }
    },
  }
}

</script>