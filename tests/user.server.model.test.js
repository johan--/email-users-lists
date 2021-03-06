'use strict';

/**
 * External Modules.
 */
const should = require('should');
const mongoose = require('mongoose');

/**
 * Internal Modules
 */

const app = require('../server');

const List = mongoose.model('List');
const User = mongoose.model('User');

/**
 * Module Globals
 */
let list;
let user;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', () => {
    beforeEach((done) => {

        list = new List ({
            name:   'An Example List',
            description: 'A description for the list list'
        });

        list.save((err, res) => {
            user = new User ({
                uuid:     '02fd837c-0a96-11e5-a6c0-1697f925ec7b',
                name:     'User Name',
                email:    'email@list.com',
                marketingPreferences: {
                    allowFt: true,
                    allow3dParty: false
                },
                lists: [res._id]
            });
            done();
        });

    });

    describe('Method Save', () => {

        it('should be able to save without problems', (done) => {
            return user.save((err) => {
                should.not.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without name', (done) => {
            user.name = '';

            return user.save((err) => {
                should.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without email', (done) => {
            user.email = '';

            return user.save((err) => {
                should.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without uuid', (done) => {

            user.uuid = '';

            return user.save((err) => {
                should.exist(err);
                done();
            });
        });

    });

    afterEach((done) => {
        User.remove()
            .exec(() => {
                List.remove().exec(done);
            });
    });
});
