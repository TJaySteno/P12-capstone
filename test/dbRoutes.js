process.env.NODE_ENV = 'test';

const express = require('express');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const Landmark = require('../models/Landmark');

const should = chai.should();

chai.use(chaiHttp);

describe('DATABASE', () => {

  let _id = '';

  before(() =>
    Landmark.remove({}, err => { if (err) console.log(err); }));

  describe('POST /api/landmarks', () => {

    it('it should POST new landmarks', () => {
      chai.request(app)
        .post('/api/landmarks')
        .type('form')
        .send({
          lat: 51.5007,
          lng: 0.1246,
          name: 'Big Ben',
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.an('object');
          res.body.should.have.all.keys('_id', 'coord', 'name', '__v');
          _id = res.body._id;

        });
    });

    it('it should not POST landmarks without coordinates', () => {
      chai.request(app)
        .post('/api/landmarks')
        .type('form')
        .send({
          lng: 0.1246,
          name: 'Big Ben',
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('coord.lat');
          res.body.errors['coord.lat'].should.have.property('kind').eql('required');

        });
    });

    it('it should not POST landmarks without name', () => {
      chai.request(app)
        .post('/api/landmarks')
        .type('form')
        .send({
          lat: 51.5007,
          lng: 0.1246,
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('name');
          res.body.errors.name.should.have.property('kind').eql('required');

        });
    });
  });

  describe('DELETE /api/landmarks', () => {

    it('it should DELETE landmarks', () => {
      chai.request(app)
        .delete('/api/landmarks')
        .type('form')
        .send({ _id })
        .end((err, res) => {
          res.should.have.status(204);

        });
    });

  });

});
