'use strict';

// Our modules
const app = require('../server');

// External modules
const should = require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const agent = request.agent(app);

// Models
const List = mongoose.model('List');


// Module globals
let list;

// List routes tests
describe('List CRUD tests:', () => {

    beforeEach((done) => {

        // Create new list
        list = new List ({
            name:   'An Example List',
            description: 'A description for the list list'
        });

        done();

    });

    it('should be able to save a list', (done) => {

        // Save a new list
        agent.post('/lists')
            .send(list)
            .expect(200)
            .end((listSaveErr) => {

                // Handle list save error
                if (listSaveErr) {
                    done(listSaveErr);
                }

                // Get a list of lists
                agent.get('/lists')
                    .end((listGetErr, listGetRes) => {

                        // Handle lists get error
                        if (listGetErr) {
                            done(listGetErr);
                        }

                        // Get lists list
                        let lists = listGetRes.body;

                        // Set assertions
                        (lists[0].name).should.match(list.name);
                        (lists[0].description).should.match(list.description);
                        // Call the assertion callback
                        done();

                    });
            });
    });


    it('should not be able to save a list if no name is provided', (done) => {
        // Invalidate name field
        list.name = '';

        // Save a new list
        agent.post('/lists')
            .send(list)
            .expect(400)
            .end((listSaveErr, listSaveRes) => {

                // Set message assertion
                should.exist(listSaveRes);
                //TODO: (listSaveRes.body.message).should.match('Name cannot be blank');
                // Handle list save error
                done(listSaveErr);

            });
    });

    it('should be able to update a list', (done) => {

        // Save a new list
        agent.post('/lists')
            .send(list)
            .expect(200)
            .end((listSaveErr, listSaveRes) => {

                let newName = 'This is a different list';
                // Handle list save error
                if (listSaveErr) {
                    done(listSaveErr);
                }

                // Update list name
                list.name = newName;

                // Update an existing list
                agent.put('/lists/' + listSaveRes.body._id)
                    .send(list)
                    .expect(200)
                    .end((listUpdateErr, listUpdateRes) => {

                        // Handle list update error
                        if (listUpdateErr) {
                            done(listUpdateErr);
                        }

                        // Set assertions
                        (listUpdateRes.body._id).should.equal(listSaveRes.body._id);
                        (listUpdateRes.body.name).should.match(newName);

                        // Call the assertion callback
                        done();
                    });
            });
    });

    it('should not be able to update a list deleting its name', (done) => {

        // Save a new list
        agent.post('/lists')
            .send(list)
            .expect(200)
            .end((listSaveErr, listSaveRes) => {

                let newName = '';
                // Handle list save error
                if (listSaveErr) {
                    done(listSaveErr);
                }

                // Update list name
                list.name = newName;

                // Update an existing list
                agent.put('/lists/' + listSaveRes.body._id)
                    .send(list)
                    .expect(400)
                    .end((listUpdateErr, listUpdateRes) => {

                        // Handle list update error
                        if (listUpdateErr) {
                            done(listUpdateErr);
                        }

                        // Set assertions
                        should.exist(listUpdateRes);
                        //TODO: (listUpdateRes.body.message).should.match('Name cannot be blank');

                        // Call the assertion callback
                        done();
                    });
            });
    });

    it('should be able to get a list of lists', (done) => {
        // Create new list model instance
        let listObj = new List(list);

        // Save the list
        listObj.save(() => {

            // Request lists
            request(app).get('/lists')
                .end((req, res) => {

                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single list', (done) => {
        // Create new list model instance
        let listObj = new List(list);

        // Save the list
        listObj.save(() => {

            request(app).get('/lists/' + listObj._id)
                .end((req, res) => {

                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', list.name);

                    // Call the assertion callback
                    done();

                });
        });
    });

    it('should return proper error for single list if an invalid _id is provided', (done) => {
        request(app).get('/lists/test')
            .end((req, res) => {
                // Set assertion
                res.body.should.be.an.Object.with.property('message', 'List is invalid');

                // Call the assertion callback
                done();
            });
    });

    it('should be able to delete a list', (done) => {

        // Save a new list
        agent.post('/lists')
            .send(list)
            .expect(200)
            .end((listSaveErr, listSaveRes) => {

                // Handle list save error
                if (listSaveErr) {
                    done(listSaveErr);
                }

                // Delete an existing list
                agent.delete('/lists/' + listSaveRes.body._id)
                    .send()
                    .expect(200)
                    .end((listDeleteErr, listDeleteRes) => {

                        // Handle list error
                        if (listDeleteErr) {
                            done(listDeleteErr);
                        }

                        // Set assertions
                        (listDeleteRes.body._id).should.equal(listSaveRes.body._id);

                        // Call the assertion callback
                        done();
                    });
            });
    });

    afterEach((done) => {
        List.remove().exec(done);
    });
});