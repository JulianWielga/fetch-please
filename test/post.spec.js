import sinon from 'sinon';
import {expect} from 'chai';
import FetchPlease from '../src/fetch-please';

let XMLHttpRequest = sinon.useFakeXMLHttpRequest();

describe('Method postRequest()', () => {
    before(function() {
        this.requests = [];
        this.api = new FetchPlease('/api/', {XMLHttpRequest});

        XMLHttpRequest.onCreate = (xhr) => {
            this.requests.push(xhr);
        };
    });

    it('exists', function() {
        expect(this.api.postRequest).to.be.a('function');
    });

    it('sends request', function() {
        expect(this.requests.length).to.equal(0);

        let {xhr, promise} = this.api.postRequest('users', null);

        expect(xhr).to.be.an.instanceof(XMLHttpRequest);
        expect(xhr.method).be.equal('POST');
        expect(promise).to.be.an.instanceof(Promise);
        expect(this.requests.length).to.equal(1);

        xhr.respond(200, {'content-type': 'application/json'}, '{"a":1}');

        return promise.then((data) => {
            expect(data).to.deep.equal({a: 1});
        });
    });

    it('sends request with string', function() {
        let {xhr} = this.api.postRequest('users', 'Hello');
        expect(xhr.requestBody).be.equal('Hello');
    });

    it('sends request with JSON', function() {
        let {xhr} = this.api.postRequest('users', {
            name: 'Mary',
            sirname: 'Brown'
        });

        expect(xhr.requestBody).be.equal('{"name":"Mary","sirname":"Brown"}');
    });

    after(function() {
        this.api = null;
        this.requests = [];
        XMLHttpRequest.onCreate = null;
    });
});

describe('Method post()', () => {
    before(function() {
        this.requests = [];
        this.api = new FetchPlease('/api/', {XMLHttpRequest});

        XMLHttpRequest.onCreate = (xhr) => {
            this.requests.push(xhr);
        };
    });

    it('exists', function() {
        expect(this.api.post).to.be.a('function');
    });

    it('sends request', function() {
        expect(this.requests.length).to.equal(0);

        let promise = this.api.post('users', null);

        expect(promise).to.be.an.instanceof(Promise);
        expect(this.requests.length).to.equal(1);

        this.requests[0].respond(200, {'content-type': 'application/json'}, '{"a":1}');

        return promise.then((data) => {
            expect(data).to.deep.equal({a: 1});
        });
    });

    after(function() {
        this.api = null;
        this.requests = [];
        XMLHttpRequest.onCreate = null;
    });
});
