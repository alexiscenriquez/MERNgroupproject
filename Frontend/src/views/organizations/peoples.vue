<script>
    import axios from 'axios'
    import Footer from '../../components/footer.vue'
    // exports array and objects
    export default{
        components:{
            Footer
        },
        data(){
            return{
                organization:[],
                volunteer:[],
                client:[],
                employee:[],
                new_vid:{id:''},
                new_cid:{id:''},
                new_eid:{id:''},
                active: false
            }
        },
        //grab peoples data before mounting dom
        created(){
            //get peoples data from organization
            let apiURL = `http://localhost:8080/organizations/organization-peoples/${this.$route.params.id}`;//backend api
            axios.get(apiURL).then(res => {
                this.organization = res.data[0];// store org data
                this.volunteer = res.data[0].volunteers;//store volunteer data
                this.client = res.data[0].clients;//store client data
                this.employee = res.data[0].employees;//store employee data
                
            }).catch(error=>{
                console.log(error)
            });
        },
        //define functions
        methods:{
            //remove volunteer from volunteer and organization collections
            rem_volunteer(ID){
                let data = {"id":ID} //store vid
                let data2 = {"id":this.$route.params.id} //store orgid
                let apiURL = `http://localhost:8080/organizations/del-vol/${this.$route.params.id}` //backend api
                let indexOfArrayItem = this.volunteer.findIndex(i=>i.vid === ID); //store vid index from array
                //remove only if true
                if(window.confirm('Remove Volunteer from Organization?')){
                    //remove volunteer from oranizations collection
                    axios.post(apiURL, data
                    ).then(()=>{
                        this.volunteer.splice(indexOfArrayItem, 1);
                    }).catch(error => {
                        console.log(error)
                    })
                    //remove from volunteers table
                    let apiURL2 = `http://localhost:8080/volunteers/del-org/${ID}`
                    axios.post(apiURL2, data2).then(()=>{
                        
                    }).catch(error =>{
                        console.log(error)
                    })
                }
            },
            //remove employees from employee and organization collection
            rem_employee(ID){
                let data = {"id":ID} //store employeeID
                let data2 = {"id":this.$route.params.id} //store orgid
                let apiURL = `http://localhost:8080/organizations/del-emp/${this.$route.params.id}` //backend api
                let indexOfArrayItem = this.employee.findIndex(i=>i.employeeID === ID); //store employeeID
                //remove only if true
                if(window.confirm('Remove employee from organization?')){
                    //remove from organizations collection
                    axios.post(apiURL, data
                    ).then(()=>{
                        this.employee.splice(indexOfArrayItem, 1);
                    }).catch(error => {
                        console.log(error)
                    })

                    //remove from employees collection
                    let apiURL2 = `http://localhost:8080/employees/del-org/${ID}`
                    axios.post(apiURL2, data2).then(()=>{
                        
                    }).catch(error =>{
                        console.log(error)
                    })
                }
            },
            //remove clients from client and organization collections
            rem_client(ID){
                let data = {"id":ID} //store cid
                let data2 = {"id":this.$route.params.id}//store orgid
                let apiURL = `http://localhost:8080/organizations/del-client/${this.$route.params.id}`//backend api
                let indexOfArrayItem = this.client.findIndex(i=>i.cid === ID);//stores cid
                //remove only if true
                if(window.confirm('Remove client from organization?')){
                    //remove from organization collection
                    axios.post(apiURL, data
                    ).then(()=>{
                        this.client.splice(indexOfArrayItem, 1);
                    }).catch(error => {
                        console.log(error)
                    })

                    //remove from clients collection
                    let apiURL2 = `http://localhost:8080/clients/del-org/${ID}`
                    axios.post(apiURL2, data2).then(()=>{
                        
                    }).catch(error =>{
                        console.log(error)
                    })
                }
            },
            // add volunteers to volunteers and organizations collection
            add_volunteer() {
                
                let idv = this.new_vid.id
                let data2 = {"id":this.$route.params.id}
                let apiURL = `http://localhost:8080/organizations/add-vol/${this.$route.params.id}`; //backend api
                //add volunteer to organization collection
                axios.post(apiURL, this.new_vid).then(() => {
                    //changing the view to the list
                    this.$router.push('/organizations')
                    //reset
                  this.new_vid = {
                    id: ''
                  }
                }).catch(error => {
                    console.log('line 59 attendees')
                    console.log(error)
                });
                //add organization to volunteers collection
                let apiURL2 = `http://localhost:8080/volunteers/add-org/${idv}`
                axios.post(apiURL2, data2).then(()=>{
                    
                }).catch(error =>{
                    console.log(error)
                })
            },
            //add employees to employees and organization colleciton
            add_employee() {
                let ide = this.new_eid.id
                let data2 = {"id":this.$route.params.id}
                let apiURL = `http://localhost:8080/organizations/add-emp/${this.$route.params.id}`;//backend api
                //add employee to organization collection
                axios.post(apiURL, this.new_eid).then(() => {
                    //changing the view to the list
                    this.$router.push('/organizations')
                    //reset
                  this.new_eid = {
                    id: ''
                  }
                }).catch(error => {
                    console.log(error)
                });
                //add organization to employee collection
                let apiURL2 = `http://localhost:8080/employees/add-org/${ide}`
                axios.post(apiURL2, data2).then(()=>{
                }).catch(error =>{
                    console.log(error)
                })
            },

            // add clients to clients and organizations collection
            add_client() {
                let dic = this.new_cid.id
                let data2 = {"id":this.$route.params.id}
                let apiURL = `http://localhost:8080/organizations/add-client/${this.$route.params.id}`;
                let apiURL2 = `http://localhost:8080/clients/add-org/${dic}`
                //add client to organizations collection
                axios.post(apiURL, this.new_cid).then(() => {
                    //changing the view to the list
                    this.$router.push('/organizations')
                    // reset
                  this.new_cid = {
                    id: ''
                  }
                }).catch(error => {
                    console.log('line 59 attendees')
                    console.log(error)
                });
                //add organization to client collection
                axios.post(apiURL2, data2).then(()=>{
                    
                }).catch(error =>{
                    console.log(error)
                })
            },
        } 
    }
</script>

<template>
    <div>
        <h1>{{organization.org_name}} #{{organization.orgid}}</h1>
        <br>
        <!-- display organization information and allow editing of organization, and addition of volunteers, clients, and employees -->
<div id="forms">
          
                        <div class='col-sm-3'> 
                            <!-- add volunteer to organization -->
                            <form @submit.prevent='add_volunteer'>
                                     <fieldset class="form-control"> 
                                         <legend>Volunteers</legend>
                                <div class='form-outline'>
                                    <input type="number" id='form14' class='form-control mb-3' v-model='new_vid.id' placeholder="Enter volunteer ID"  required>
                                   
                                    <button class='btn btn-secondary'>Add Volunteer</button>
                                </div>
                                     </fieldset>
                            </form> 
                        </div>
                        <!-- add employee to organizaiton -->
                        
                        <div class='col-sm-3'>
                            <form @submit.prevent='add_employee'>
                                <fieldset class="form-control">
                                    <legend>Employees</legend>
                            <div class='form-group'>
                                <input type="number" class='form-control mb-3' v-model='new_eid.id' placeholder="Enter employee ID" required>

                                <button class='btn btn-secondary'>Add Employee</button>
                            </div>
                                </fieldset>
                            </form> 
                        </div>

                        <!-- add client to organization -->
    
                            <div class='col-sm-3'>
                                <form @submit.prevent='add_client' >
                                    <fieldset class="form-control">
                                        <legend>Clients</legend>
                                <div class='form-group'>
                                    <input type="number" placeholder="Enter Client ID" class='form-control mb-3' v-model='new_cid.id'  required>
                            
                                    <button class='btn btn-secondary' >Add Client</button>
                                </div>
                                </fieldset>
                                </form> 
                            </div>
                            
           
</div>
    
   

        <!-- display volunteer table and allow removal -->
        <div class="row justify-content-center mt-5">
            <table class="table table-light table-hover caption-top">
                <caption><strong>Volunteers</strong></caption>
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone#</th>
                        <th colspan="6">Actions</th>    
                    </tr>
                </thead>
                <tbody>
                    <!-- display info for each volunteer in array, allow user to remove volunteer by vid -->
                    <tr v-for="v in volunteer" :key="v.vid">
                        <td>{{v.vid }}</td>
                        <td>{{v.first_name }}</td>
                        <td>{{v.last_name }}</td>
                        <td>{{v.phone_num }}</td>
                        <!-- call function to remove volunteer from organizations collection -->
                        <td><button @click.prevent="rem_volunteer(v.vid)" class="btn btn-secondary">Remove</button></td>
                
                    </tr> 
                </tbody>
            </table>
        </div>

        <!-- display employees table and allow removal -->
        <div class="row justify-content-center">
            <table class="table table-light table-hover caption-top">
                <caption><strong>Employees</strong></caption>
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone#</th>
                        <th colspan="6">Actions</th>    
                    </tr>
                </thead>
                <tbody>
                    <!-- display information for each employee in array, allow user to remove employee by employeeID -->
                    <tr v-for="e in employee" :key="e.employeeID">
                        <td>{{e.employeeID }}</td>
                        <td>{{e.firstName }}</td>
                        <td>{{e.lastName }}</td>
                        <td>{{e.phone}}</td>
                        <!-- call function to remove employee from organizations collection -->
                        <td><router-link :to="{name: 'edit-emp', params: { id: e.employeeID }}" class="btn btn-secondary ">Change Org</router-link></td>
                    </tr> 
                </tbody>
            </table>
        </div>
        <!-- display clients table and allow removal -->
        <div class="row justify-content-center">
            <table class="table table-light table-hover caption-top">
                <caption><strong>Clients</strong></caption>
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone#</th>
                        <th colspan="6">Actions</th>    
                    </tr>
                </thead>
                <tbody>
                    <!-- display information for each client in array, allow user to remove client by cid -->
                    <tr v-for="c in client" :key="c.cid">
                        <td>{{c.cid }}</td>
                        <td>{{c.first_name }}</td>
                        <td>{{c.last_name}}</td>
                        <td>{{c.phone}}</td>
                        <!-- call function to remove client from organizations collection -->
                        <td><button @click.prevent="rem_client(c.cid)" class="btn btn-secondary">Remove</button></td>
                    </tr> 
                </tbody>
            </table>
        </div>
        <Footer />
    </div>

    
</template>

<style scoped>
 @import "../../assets/app.css";
</style>

