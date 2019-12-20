<template>
    <div class="board">
        <b-row>

            <!-- TODOs LIST-->
            <b-col class="draggable-container" md="4" sm="12">
                <h4 class="text-left">
                    <v-icon name="list-ul" scale="1.5"/>
                    <span class="mt-3 ml-2">TODO</span></h4>


                <draggable :list="todoList" @change="updateTask($event,'TODO')" @end="drag=false" @start="drag=true"
                           animation=300
                           class="draggable-container" group="tasks">
                    <div v-bind:key="task.id" v-for="task in todoList">

                        <b-card
                                :title="task.title"
                                class="mb-2"
                                style="max-width: 20rem;">
                            <b-card-text>
                                {{task.description}}
                            </b-card-text>

                            <span>Due Date: {{task.dueDate | formatDate}}</span>

                        </b-card>
                    </div>

                </draggable>


            </b-col>


            <!-- ONGOING LIST -->
            <b-col class="draggable-container" md="4" sm="12">
                <h4 class="text-left">
                    <v-icon name="spinner" scale="1.5"/>
                    <span class="mt-3 ml-2">ONGOING</span></h4>

                <draggable :list="ongoingList" @change="updateTask($event,'ONGOING')" @end="drag=false"
                           @start="drag=true"
                           animation=300 class="draggable-container"
                           group="tasks">

                    <div v-bind:key="task.id" v-for="task in ongoingList">
                        <b-card
                                :title="task.title"
                                class="mb-2"
                                style="max-width: 20rem;">
                            <b-card-text>
                                {{task.description}}
                            </b-card-text>

                            <span>Due Date: {{task.dueDate | formatDate}}</span>

                        </b-card>
                    </div>

                </draggable>

            </b-col>


            <!-- DONE LIST -->
            <b-col class="draggable-container" md="4" sm="12">

                <h4 class="text-left">
                    <v-icon name="check-circle" scale="1.5"/>
                    <span class="mt-3 ml-2">DONE</span></h4>


                <draggable :list="doneList" @change="updateTask($event,'DONE')" @end="drag=false" @start="drag=false"
                           animation=300
                           class="draggable-container" group="tasks">
                    <div v-bind:key="task.id" v-for="task in doneList">

                        <b-card
                                :title="task.title"
                                class="mb-2"
                                style="max-width: 20rem;">
                            <div class="date-banner">Completed On: {{task.completedDate | formatDate}}</div>

                            <b-card-text>
                                {{task.description}}
                            </b-card-text>

                            <span>Due Date: {{task.dueDate | formatDate}}</span>

                        </b-card>
                    </div>

                </draggable>

            </b-col>
        </b-row>


        <button class="circular-button" v-b-modal.modal-1>
            <v-icon name="plus" scale="1.5"/>
        </button>

        <b-modal centered id="modal-1" title="Create A Task" v-on:ok="createTask">
            <div class="form-group">
                <label for="title">TITLE</label>
                <input class="form-control" id="title" placeholder="Task Title"
                       type="text" v-model="taskToCreate.title">
            </div>
            <div class="form-group">
                <label for="description">DESCRIPTION</label>
                <textarea class="form-control" id="description"
                          placeholder="Task Description" v-model="taskToCreate.description"></textarea>
            </div>
            <div class="form-group">
                <label for="due-date">DUE DATE</label>
                <input class="form-control" id="due-date" placeholder="dd/mm/yyyy"
                       type="date" v-model="taskToCreate.dueDate">

            </div>
        </b-modal>
    </div>

</template>

<script>
    import axios from 'axios';
    import draggable from 'vuedraggable'
    import Icon from 'vue-awesome/components/Icon'


    export default {
        name: "Board",
        components: {
            draggable,
            'v-icon': Icon,

        },
        data() {
            return {
                tasks: [],
                todoList: [],
                ongoingList: [],
                doneList: [],
                taskToCreate: {
                    title: '',
                    description: '',
                    type: '',
                    dueDate: '',
                    completedDate: null,
                }
            }
        },

        created() {
            axios.get(`http://localhost:8080/tasks`)
                .then(response => {

                    this.tasks = response.data;
                    this.tasks.map(task => {
                        switch (task.type) {
                            case 'TODO':
                                this.todoList.push(task);
                                break;

                            case 'ONGOING':
                                this.ongoingList.push(task);
                                break;

                            case 'DONE':
                                this.doneList.push(task);

                                break;
                        }
                    });

                })
        },
        methods: {
            updateTask: function (evt, type) {
                if (evt.added) {
                    const taskToUpdate = evt.added.element;


                    axios.put(`http://localhost:8080/tasks/${taskToUpdate.id}`, {
                        'title': taskToUpdate.title,
                        'description': taskToUpdate.description,
                        'dueDate': taskToUpdate.dueDate,
                        'type': type,
                        'completedDate': new Date(),
                    })
                        .then(response => {

                            if (type === 'DONE') {
                                let itemIndex = this.doneList.findIndex(v => v.id === taskToUpdate.id);
                                this.doneList[itemIndex].completedDate = response.data.completedDate;
                            }


                        })
                        .catch(e => {
                        });


                }
            },

            createTask: function () {


                axios.post(`http://localhost:8080/tasks`, {
                    'title': this.taskToCreate.title,
                    'description': this.taskToCreate.description,
                    'dueDate': this.taskToCreate.dueDate,
                    'type': 'TODO',
                    'completedDate': this.taskToCreate.completedDate,
                })
                    .then(response => {

                        const task = response.data;

                        this.todoList.push(task)

                    })
                    .catch(e => {
                    })

            }
        }
    }
</script>

<style scoped>

    .circular-button {
        position: fixed;
        bottom: 70px;
        right: 50px;
        width: 50px;
        height: 50px;
        background-color: #2c3e50;
        border: 0;
        border-radius: 50%;
        color: white;
    }

    .draggable-container {
        min-height: 80vh !important;
    }

    .date-banner {
        position: absolute;
        top: 0;
        right: 0;
        color: white;
        background-color: #5fb434;
        padding: 2px;
        font-size: 12px;
    }


</style>
