process.env.NODE_ENV = 'test';

const express = require('express');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('EXTERNAL API ROUTES', () => {

  describe('GET /api/iss', () => {
    it('it should current ISS location', done => {
      chai.request(app)
        .get('/api/iss')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.all.keys('lat', 'lng');
          done();
        });
    });
  });

  describe('POST /api/resposition', () => {
    it('it should return formatted info on given coordinates', done => {
      chai.request(app)
        .post('/api/reposition')
        .type('form')
        .send({
          lat: 51,
          lng: 1,
          scale: 'metric'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');

          res.body.should.have.all.keys('passtimes', 'weather');
          res.body.passtimes.should.be.an('array');
          res.body.weather.should.be.an('object');

          res.body.weather.should.have.all.keys('classTemp', 'current', 'forecast');
          res.body.weather.classTemp.should.be.an('object');
          res.body.weather.current.should.be.an('object');
          res.body.weather.forecast.should.be.an('array');

          done();
        });
    });

    it('it should require coordinates', done => {
      chai.request(app)
        .post('/api/reposition')
        .type('form')
        .send({
          lng: 1,
          scale: 'metric'
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('POST /api/weather', () => {
    it('it should retrieve the weather', done => {
      chai.request(app)
        .post('/api/weather')
        .type('form')
        .send({
          lat: 51,
          lng: 1,
          scale: 'metric'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');

          res.body.should.have.all.keys('classTemp', 'current', 'forecast');
          res.body.classTemp.should.be.an('object');
          res.body.current.should.be.an('object');
          res.body.forecast.should.be.an('array');
          done();
        });
    });
  });

});
