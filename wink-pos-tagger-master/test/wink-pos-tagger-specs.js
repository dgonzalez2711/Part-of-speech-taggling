//     wink-pos-tagger
//     English Part-of-speech (POS) tagger
//
//     Copyright (C) 2017-19  GRAYPE Systems Private Limited
//
//     This file is part of “wink-pos-tagger”.
//
//     Permission is hereby granted, free of charge, to any person obtaining a
//     copy of this software and associated documentation files (the "Software"),
//     to deal in the Software without restriction, including without limitation
//     the rights to use, copy, modify, merge, publish, distribute, sublicense,
//     and/or sell copies of the Software, and to permit persons to whom the
//     Software is furnished to do so, subject to the following conditions:
//
//     The above copyright notice and this permission notice shall be included
//     in all copies or substantial portions of the Software.
//
//     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
//     OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//     THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//     DEALINGS IN THE SOFTWARE.

//
/* eslint-disable no-console */

var chai = require( 'chai' );
var mocha = require( 'mocha' );
var tagger = require( '../src/wink-pos-tagger.js' )();
var tk = require( 'wink-tokenizer' )().tokenize;

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

var tag = tagger.tag;
var tagSentence = tagger.tagSentence;
var tagRawTokens = tagger.tagRawTokens;
var defineConfig = tagger.defineConfig;
var updateLexicon = tagger.updateLexicon;

describe( 'wink-pos-tagger', function () {
  it( 'should tag a simple sentence', function () {
      var output = [ { value: 'this', tag: 'word', pos: 'DT', normal: 'this' },
                     { value: 'is', tag: 'word', pos: 'VBZ', normal: 'is', lemma: 'be' },
                     { value: 'a', tag: 'word', pos: 'DT', normal: 'a' },
                     { value: 'simple', tag: 'word', pos: 'JJ', normal: 'simple', lemma: 'simple' },
                     { value: 'sentence', tag: 'word', pos: 'NN', normal: 'sentence', lemma: 'sentence' } ];
      expect( tag( tk( 'this is a simple sentence' ) ) ).to.deep.equal( output );
  } );

  it( 'should tag a little more complex sentence', function () {
      var output = [ { value: 'The', tag: 'word', pos: 'DT', normal: 'the' },
                     { value: 'horses', tag: 'word', pos: 'NNS', normal: 'horses', lemma: 'horse' },
                     { value: 'were', tag: 'word', pos: 'VBD', normal: 'were', lemma: 'be' },
                     { value: 'broken', tag: 'word', pos: 'VBN', normal: 'broken', lemma: 'break' },
                     { value: 'in', tag: 'word', pos: 'IN', normal: 'in' },
                     { value: 'and', tag: 'word', pos: 'CC', normal: 'and' },
                     { value: 'ridden', tag: 'word', pos: 'VBN', normal: 'ridden', lemma: 'ride' },
                     { value: 'in', tag: 'word', pos: 'IN', normal: 'in' },
                     { value: 'two', tag: 'word', pos: 'CD', normal: 'two' },
                     { value: 'weeks', tag: 'word', pos: 'NNS', normal: 'weeks', lemma: 'week' },
                     { value: '.', tag: 'punctuation', pos: '.', normal: '.' } ];
      expect( tag( tk( 'The horses were broken in and ridden in two weeks.' ) ) ).to.deep.equal( output );
  } );

  it( 'should tag ...would like... triggering delta rule', function () {
      var output = [ { value: 'I', tag: 'word', pos: 'PRP', normal: 'i' },
                     { value: 'would', tag: 'word', pos: 'MD', normal: 'would', lemma: 'will' },
                     { value: 'like', tag: 'word', pos: 'VB', normal: 'like', lemma: 'like' },
                     { value: 'to', tag: 'word', pos: 'TO', normal: 'to' },
                     { value: 'eat', tag: 'word', pos: 'VB', normal: 'eat', lemma: 'eat' },
                     { value: 'a', tag: 'word', pos: 'DT', normal: 'a' },
                     { value: 'banana', tag: 'word', pos: 'NN', normal: 'banana', lemma: 'banana' },
                     { value: '.', tag: 'punctuation', pos: '.', normal: '.' } ];
      expect( tag( tk( 'I would like to eat a banana.' ) ) ).to.deep.equal( output );
  } );

  it( 'should tag ...like to... triggering delta rule', function () {
      var output = [ { value: 'I', tag: 'word', normal: 'i', pos: 'PRP' },
                     { value: 'Like', tag: 'word', normal: 'like', pos: 'VBP', lemma: 'like' },
                     { value: 'to', tag: 'word', normal: 'to', pos: 'TO' },
                     { value: 'have', tag: 'word', normal: 'have', pos: 'VB', lemma: 'have' },
                     { value: 'tea', tag: 'word', normal: 'tea', pos: 'NN', lemma: 'tea' },
                     { value: 'everyday', tag: 'word', normal: 'everyday', pos: 'JJ',lemma: 'everyday' } ];
      // This will test that we are using normal and not value.
      expect( tag( tk( 'I Like to have tea everyday' ) ) ).to.deep.equal( output );
  } );

  it( 'should use WDT rule: seems so Indian English!', function () {
      var output = [ { value: 'what', tag: 'word', pos: 'WP', normal: 'what' },
                     { value: 'o\'hara', tag: 'word', pos: 'NNP', normal: 'o\'hara', lemma: 'o\'hara' } ];
      expect( tag( tk( 'what o\'hara' ) ) ).to.deep.equal( output );
  } );

  it( 'should work with am/is/are followed by ...ing', function () {
      var output = [ { value: 'I', tag: 'word', pos: 'PRP', normal: 'i' },
                     { value: 'am', tag: 'word', pos: 'VBP', normal: 'am', lemma: 'be' },
                     { value: 'feeling', tag: 'word', pos: 'VBG', normal: 'feeling', lemma: 'feel' } ];
      expect( tag( tk( 'I am feeling' ) ) ).to.deep.equal( output );
      output = [ { value: 'I', tag: 'word', pos: 'PRP', normal: 'i' },
                 { value: 'have', tag: 'word', pos: 'VBP', normal: 'have', lemma: 'have' },
                 { value: 'a', tag: 'word', pos: 'DT', normal: 'a' },
                 { value: 'feeling', tag: 'word', pos: 'NN', normal: 'feeling', lemma: 'feeling' } ];
      expect( tag( tk( 'I have a feeling' ) ) ).to.deep.equal( output );
  } );
} );

describe( 'wink-pos-tagger/entity', function () {
  it( 'should tag a sentence with entity', function () {
      var output = [ { value: 'I', tag: 'word', pos: 'PRP', normal: 'i' },
                     { value: 'live', tag: 'word', pos: 'VBP', normal: 'live', lemma: 'live' },
                     { value: 'in', tag: 'word', pos: 'IN', normal: 'in' },
                     { value: 'denmark', tag: 'word', pos: 'NNP', entityType: 'location', normal: 'denmark', lemma: 'denmark' } ];
      expect( tagger.tag( [
                            { value: 'I', tag: 'word' },
                            { value: 'live', tag: 'word' },
                            { value: 'in', tag: 'word' },
                            { value: 'denmark', tag: 'word', pos: 'NNP', entityType: 'location' } ]
       ) ).to.deep.equal( output );
  } );

  it( 'should tag the same sentence without pos undefined at NER time', function () {
      var output = [ { value: 'I', tag: 'word', pos: 'PRP', normal: 'i' },
                     { value: 'live', tag: 'word', pos: 'VBP', normal: 'live', lemma: 'live' },
                     { value: 'in', tag: 'word', pos: 'IN', normal: 'in' },
                     { value: 'denmark', tag: 'word', pos: 'NN', entityType: 'location', normal: 'denmark', lemma: 'denmark' } ];
      expect( tagger.tag( [
                            { value: 'I', tag: 'word' },
                            { value: 'live', tag: 'word' },
                            { value: 'in', tag: 'word' },
                            { value: 'denmark', tag: 'word', entityType: 'location' } ]
       ) ).to.deep.equal( output );
  } );

} );

describe( 'wink-pos-tagger/update lexicon', function () {
  it( 'should tag - I eat', function () {
      var output = [ { value: 'I', tag: 'word', pos: 'PRP', normal: 'i' },
                     { value: 'eat', tag: 'word', pos: 'VBP', normal: 'eat', lemma: 'eat' } ];
      expect( tagger.tag( tk( 'I eat' ) ) ).to.deep.equal( output );
  } );

  it( 'should throws error on null input', function () {
      expect( tagger.updateLexicon.bind( null ) ).to.throw( 'wink-pos-tagger/updateLexicon: lexicon must be an object, instead found: undefined' );
  } );

  it( 'shoud tag eat as noun after it is updated eat as noun', function () {
      var output = [ { value: 'I', tag: 'word', pos: 'PRP', normal: 'i' },
                     { value: 'eat', tag: 'word', pos: 'NN', normal: 'eat', lemma: 'eat' } ];
      expect( tagger.updateLexicon( { EAT: [ 'NN' ] } ) ).to.deep.equal( undefined );
      expect( tagger.tag( tk( 'I eat' ) ) ).to.deep.equal( output );
  } );
} );

describe( 'wink-pos-tagger/range rules', function () {
  it( 'should tag - A bear just crossed the road', function () {
      var output = [ { value: 'A', tag: 'word', pos: 'DT', normal: 'a' },
                     { value: 'bear', tag: 'word', pos: 'NN', normal: 'bear', lemma: 'bear' },
                     { value: 'just', tag: 'word', pos: 'RB', normal: 'just' },
                     { value: 'crossed', tag: 'word', pos: 'VBD', normal: 'crossed', lemma: 'cross' },
                     { value: 'the', tag: 'word', pos: 'DT', normal: 'the' },
                     { value: 'road', tag: 'word', pos: 'NN', normal: 'road', lemma: 'road' } ];
      expect( tag( tk( 'A bear just crossed the road' ) ) ).to.deep.equal( output );
  } );

  it( 'should tag - I will bear the expenses', function () {
      var output = [ { value: 'I', tag: 'word', pos: 'PRP', normal: 'i' },
                     { value: 'will', tag: 'word', pos: 'MD', normal: 'will', lemma: 'will' },
                     { value: 'bear', tag: 'word', pos: 'VB', normal: 'bear', lemma: 'bear' },
                     { value: 'the', tag: 'word', pos: 'DT', normal: 'the' },
                     { value: 'expense', tag: 'word', pos: 'NN', normal: 'expense', lemma: 'expense' } ];
      expect( tag( tk( 'I will bear the expense' ) ) ).to.deep.equal( output );
  } );

  it( 'should tag - The pencil has a sharp point...', function () {
      var output = [ { value: 'The', tag: 'word', pos: 'DT', normal: 'the' },
                     { value: 'pencil', tag: 'word', pos: 'NN', normal: 'pencil', lemma: 'pencil' },
                     { value: 'has', tag: 'word', pos: 'VBZ', normal: 'has', lemma: 'have' },
                     { value: 'a', tag: 'word', pos: 'DT', normal: 'a' },
                     { value: 'sharp', tag: 'word', pos: 'JJ', normal: 'sharp', lemma: 'sharp' },
                     { value: 'point', tag: 'word', pos: 'NN', normal: 'point', lemma: 'point' },
                     { value: '.', tag: 'punctuation', pos: '.', normal: '.' },
                     { value: 'It', tag: 'word', pos: 'PRP', normal: 'it' },
                     { value: 'is', tag: 'word', pos: 'VBZ', normal: 'is', lemma: 'be' },
                     { value: 'not', tag: 'word', pos: 'RB', normal: 'not' },
                     { value: 'polite', tag: 'word', pos: 'JJ', normal: 'polite', lemma: 'polite' },
                     { value: 'to', tag: 'word', pos: 'TO', normal: 'to' },
                     { value: 'point', tag: 'word', pos: 'VB', normal: 'point', lemma: 'point' },
                     { value: 'at', tag: 'word', pos: 'IN', normal: 'at' },
                     { value: 'people', tag: 'word', pos: 'NNS', normal: 'people', lemma: 'people' },
                     { value: '.', tag: 'punctuation', pos: '.', normal: '.' } ];
      expect( tag( tk( 'The pencil has a sharp point. It is not polite to point at people.' ) ) ).to.deep.equal( output );
  } );
} );

describe( 'wink-pops-tagger/tagSentence', function () {
  it( 'should tag an blank sentence', function () {
      var output = [ ];
      expect( tagSentence( '' ) ).to.deep.equal( output );
  } );

  it( 'should throw error with undefined sentence', function () {
      expect( tagSentence.bind( null ) ).to.throw( 'wink-pos-tagger: input sentence must be a string, instead found: undefined' );
  } );
} );

describe( 'wink-pos-tagger/defineConfig', function () {
  it( 'should return lemma: ture on lemma: false ', function () {
      expect( defineConfig( { lemma: false } ) ).to.deep.equal( { lemma: true, normal: true } );
  } );
} );

describe( 'wink-pos-tagger/normalization', function () {
  it( 'should add of normal in tokens properly', function () {
    var output = [ { value: 'Nestlé', tag: 'word', pos: 'NNP', normal: 'nestle', lemma: 'nestle' },
               { value: 'is', tag: 'word', pos: 'VBZ', normal: 'is', lemma: 'be' },
               { value: 'an', tag: 'word', pos: 'DT', normal: 'an' },
               { value: 'organization', tag: 'word', pos: 'NN', normal: 'organization', lemma: 'organization' } ];

    expect( tagSentence( 'Nestlé is an organization' ) ).to.deep.equal( output );
  } );
} );

describe( 'wink-pos-tagger/complex sentences', function () {
  it( 'should tag ...fish fish in the...', function () {
    var output = [ { value: 'He', tag: 'word', normal: 'he', pos: 'PRP' },
                   { value: 'will', tag: 'word', normal: 'will', pos: 'MD', lemma: 'will' },
                   { value: 'be', tag: 'word', normal: 'be', pos: 'VB', lemma: 'be' },
                   { value: 'trying', tag: 'word', normal: 'trying', pos: 'VBG', lemma: 'try' },
                   { value: 'to', tag: 'word', normal: 'to', pos: 'TO' },
                   { value: 'fish', tag: 'word', normal: 'fish', pos: 'VB', lemma: 'fish' },
                   { value: 'fish', tag: 'word', normal: 'fish', pos: 'NN', lemma: 'fish' },
                   { value: 'in', tag: 'word', normal: 'in', pos: 'IN' },
                   { value: 'the', tag: 'word', normal: 'the', pos: 'DT' },
                   { value: 'lake', tag: 'word', normal: 'lake', pos: 'NN', lemma: 'lake' },
                   { value: '.', tag: 'punctuation', normal: '.', pos: '.' } ];

    expect( tagSentence( 'He will be trying to fish fish in the lake.' ) ).to.deep.equal( output );
  } );

  it( 'should tag ...fish best fishes in...', function () {
    var output = [ { value: 'He', tag: 'word', pos: 'PRP', normal: 'he' },
                   { value: 'will', tag: 'word', pos: 'MD', lemma: 'will', normal: 'will' },
                   { value: 'be', tag: 'word', pos: 'VB', lemma: 'be', normal: 'be' },
                   { value: 'trying', tag: 'word', pos: 'VBG', lemma: 'try', normal: 'trying' },
                   { value: 'to', tag: 'word', pos: 'TO', normal: 'to' },
                   { value: 'fish', tag: 'word', pos: 'VB', lemma: 'fish', normal: 'fish' },
                   { value: 'best', tag: 'word', pos: 'JJS', lemma: 'good', normal: 'best' },
                   { value: 'fishes', tag: 'word', pos: 'NNS', lemma: 'fish', normal: 'fishes' },
                   { value: 'in', tag: 'word', pos: 'IN', normal: 'in' },
                   { value: 'a', tag: 'word', pos: 'DT', normal: 'a' },
                   { value: 'good', tag: 'word', pos: 'JJ', lemma: 'good', normal: 'good' },
                   { value: 'lake', tag: 'word', pos: 'NN', lemma: 'lake', normal: 'lake' },
                   { value: '.', tag: 'punctuation', pos: '.', normal: '.' } ];

    expect( tagSentence( 'He will be trying to fish best fishes in a good lake.' ) ).to.deep.equal( output );
  } );

  it( 'should tag a sentence containing &', function () {
    var output = [ { value: 'He', tag: 'word', pos: 'PRP', normal: 'he' },
                   { value: '&', tag: 'symbol', pos: 'CC', normal: '&' },
                   { value: 'his', tag: 'word', pos: 'PRP$', normal: 'his' },
                   { value: 'friend', tag: 'word', pos: 'NN', normal: 'friend', lemma: 'friend' },
                   { value: 'are', tag: 'word', pos: 'VBP', normal: 'are', lemma: 'be' },
                   { value: 'walking', tag: 'word', pos: 'VBG', normal: 'walking', lemma: 'walk' } ];

    expect( tagSentence( 'He & his friend are walking' ) ).to.deep.equal( output );
  } );

  it( 'should tags a sentence containing % & #', function () {
    var output = [ { value: 'I', tag: 'word', pos: 'PRP', normal: 'i' },
                   { value: 'earned', tag: 'word', pos: 'VBD', normal: 'earned', lemma: 'earn' },
                   { value: '10', tag: 'number', pos: 'CD', normal: '10' },
                   { value: '%', tag: 'symbol', pos: 'NN', normal: '%', lemma: '%' },
                   { value: 'bonus', tag: 'word', pos: 'NN', normal: 'bonus', lemma: 'bonus' },
                   { value: 'in', tag: 'word', pos: 'IN', normal: 'in' },
                   { value: 'the', tag: 'word', pos: 'DT', normal: 'the' },
                   { value: '1st', tag: 'ordinal', pos: 'JJ', normal: '1st', lemma: '1st' },
                   { value: 'quarter', tag: 'word', pos: 'NN', normal: 'quarter', lemma: 'quarter' },
                   { value: 'for', tag: 'word', pos: 'IN', normal: 'for' },
                   { value: 'being', tag: 'word', pos: 'VBG', normal: 'being', lemma: 'being' },
                   { value: '#', tag: 'symbol', pos: 'NN', normal: '#', lemma: '#' },
                   { value: '3', tag: 'number', pos: 'CD', normal: '3' } ];

    expect( tagSentence( 'I earned 10% bonus in the 1st quarter for being #3' ) ).to.deep.equal( output );
  } );
} );

describe( 'wink-pos-tagger/contractions & NNP', function () {
  it( 'should tag a sentence with contraction verb and NNP', function () {
    var output = [ { value: 'I', tag: 'word', normal: 'i', pos: 'PRP' },
                   { value: 'sha', tag: 'word', normal: 'sha', pos: 'MD', lemma: 'shall' },
                   { value: 'n\'t', tag: 'word', normal: 'n\'t', pos: 'RB', lemma: 'not' },
                   { value: 'go', tag: 'word', normal: 'go', pos: 'VB', lemma: 'go' },
                   { value: 'today', tag: 'word', normal: 'today', pos: 'NN', lemma: 'today' },
                   { value: 'to', tag: 'word', normal: 'to', pos: 'TO' },
                   { value: 'meet', tag: 'word', normal: 'meet', pos: 'VB', lemma: 'meet' },
                   { value: 'O\'Hara', tag: 'word', normal: 'o\'hara', pos: 'NNP', lemma: 'o\'hara' } ];

    updateLexicon( { 'O\'Hara': [ 'NNP' ] } );
    expect( tagSentence( 'I shan\'t go today to meet O\'Hara' ) ).to.deep.equal( output );
  } );

  it( 'should tag a sentence containing ain\'t', function () {
    var output = [ { value: 'I', tag: 'word', normal: 'i', pos: 'PRP' },
                   { value: 'ai', tag: 'word', normal: 'ai', pos: 'VBP', lemma: 'be' },
                   { value: 'n\'t', tag: 'word', normal: 'n\'t', pos: 'RB', lemma: 'not' },
                   { value: 'got', tag: 'word', normal: 'got', pos: 'VBN', lemma: 'get' },
                   { value: 'nothing', tag: 'word', normal: 'nothing', pos: 'NN', lemma: 'nothing' },
                   { value: 'left', tag: 'word', normal: 'left', pos: 'VBN', lemma: 'leave' } ];

    expect( tagSentence( 'I ain\'t got nothing left' ) ).to.deep.equal( output );
  } );

  it( 'should tag a sentence containing can\'t', function () {
    var output = [ { value: 'I', tag: 'word', normal: 'i', pos: 'PRP' },
                   { value: 'ca', tag: 'word', normal: 'ca', pos: 'MD', lemma: 'can' },
                   { value: 'n\'t', tag: 'word', normal: 'n\'t', pos: 'RB', lemma: 'not' },
                   { value: 'do', tag: 'word', normal: 'do', pos: 'VB', lemma: 'do' } ];

    expect( tagSentence( 'I can\'t do' ) ).to.deep.equal( output );
  } );

  it( 'should tag a sentence containing \'ve & a country/NNP', function () {
    var output = [ { value: 'I', tag: 'word', normal: 'i', pos: 'PRP' },
                   { value: '\'ve', tag: 'word', normal: '\'ve', pos: 'VBP', lemma: 'have' },
                   { value: 'got', tag: 'word', normal: 'got', pos: 'VBN', lemma: 'get' },
                   { value: 'a', tag: 'word', normal: 'a', pos: 'DT' },
                   { value: 'gem', tag: 'word', normal: 'gem', pos: 'NN', lemma: 'gem' },
                   { value: 'from', tag: 'word', normal: 'from', pos: 'IN' },
                   { value: 'India', tag: 'word', normal: 'india', pos: 'NNP', lemma: 'india' } ];

    expect( tagSentence( 'I\'ve got a gem from India' ) ).to.deep.equal( output );
  } );

  it( 'should tag a sentence containing \'s as verb', function () {
    var output = [ { value: 'Then', tag: 'word', normal: 'then', pos: 'RB' },
                   { value: '\'s', tag: 'word', normal: '\'s', pos: 'VBZ', lemma: 'be' },
                   { value: 'the', tag: 'word', normal: 'the', pos: 'DT' },
                   { value: 'time', tag: 'word', normal: 'time', pos: 'NN', lemma: 'time' },
                   { value: 'to', tag: 'word', normal: 'to', pos: 'TO' },
                   { value: 'time', tag: 'word', normal: 'time', pos: 'VB', lemma: 'time' },
                   { value: 'the', tag: 'word', normal: 'the', pos: 'DT' },
                   { value: 'time', tag: 'word', normal: 'time', pos: 'NN', lemma: 'time' },
                   { value: 'flies', tag: 'word', normal: 'flies', pos: 'VBZ', lemma: 'fly' } ];

    expect( tagSentence( 'Then\'s the time to time the time flies' ) ).to.deep.equal( output );
  } );

  it( 'should tag a sentence containing \'s as POS', function () {
    var output = [ { value: 'This', tag: 'word', normal: 'this', pos: 'DT' },
                   { value: 'is', tag: 'word', normal: 'is', pos: 'VBZ', lemma: 'be' },
                   { value: 'John', tag: 'word', normal: 'john', pos: 'NNP', lemma: 'john' },
                   { value: '\'s', tag: 'word', normal: '\'s', pos: 'POS' },
                   { value: 'food', tag: 'word', normal: 'food', pos: 'NN', lemma: 'food' },
                   { value: '.', tag: 'punctuation', normal: '.', pos: '.' } ];

    expect( tagSentence( 'This is John\'s food.' ) ).to.deep.equal( output );
  } );

  it( 'should tag a sentence containing won\'t', function () {
    var output = [ { value: 'I', tag: 'word', normal: 'i', pos: 'PRP' },
                   { value: 'wo', tag: 'word', normal: 'wo', pos: 'MD', lemma: 'will' },
                   { value: 'n\'t', tag: 'word', normal: 'n\'t', pos: 'RB', lemma: 'not' },
                   { value: 'believe', tag: 'word', normal: 'believe', pos: 'VB', lemma: 'believe' },
                   { value: 'you', tag: 'word', normal: 'you', pos: 'PRP' },
                   { value: '.', tag: 'punctuation', normal: '.', pos: '.' } ];

    expect( tagSentence( 'I won\'t believe you.' ) ).to.deep.equal( output );
  } );

  it( 'should tag a sentence containing won\'t, unk verb and proper noun', function () {
    var output = [ { value: 'Chris', tag: 'word', normal: 'chris', pos: 'NNP', lemma: 'chris' },
                   { value: 'wo', tag: 'word', normal: 'wo', pos: 'MD', lemma: 'will' },
                   { value: 'n\'t', tag: 'word', normal: 'n\'t', pos: 'RB', lemma: 'not' },
                   { value: 'forgo', tag: 'word', normal: 'forgo', pos: 'VB', lemma: 'forgo' },
                   { value: 'the', tag: 'word', normal: 'the', pos: 'DT' },
                   { value: 'tea', tag: 'word', normal: 'tea', pos: 'NN', lemma: 'tea' },
                   { value: '!', tag: 'punctuation', normal: '!', pos: '.' } ];

    expect( tagSentence( 'Chris won\'t forgo the tea!' ) ).to.deep.equal( output );
  } );

  it( 'should tag a captitalized word as NNP', function () {
    var output = [ { value: 'Vishnu', tag: 'word', normal: 'vishnu', pos: 'NNP', lemma: 'vishnu' },
                   { value: 'is', tag: 'word', normal: 'is', pos: 'VBZ', lemma: 'be' },
                   { value: 'created', tag: 'word', normal: 'created', pos: 'VBN', lemma: 'create' },
                   { value: 'the', tag: 'word', normal: 'the', pos: 'DT' },
                   { value: 'universe', tag: 'word', normal: 'universe', pos: 'NN', lemma: 'universe' },
                   { value: '!', tag: 'punctuation', normal: '!', pos: '.' } ];

    expect( tagSentence( 'Vishnu is created the universe!' ) ).to.deep.equal( output );
  } );

  it( 'should tags a containing captitalized JJ correctly as NNP', function () {
    var output = [ { value: 'Walter', tag: 'word', pos: 'NNP', normal: 'walter', lemma: 'walter' },
                   { value: 'Sisulu', tag: 'word', pos: 'NNP', normal: 'sisulu', lemma: 'sisulu' },
                   { value: 'and', tag: 'word', pos: 'CC', normal: 'and' },
                   { value: 'the', tag: 'word', pos: 'DT', normal: 'the' },
                   { value: 'African', tag: 'word', pos: 'NNP', normal: 'african', lemma: 'african' },
                   { value: 'National', tag: 'word', pos: 'NNP', normal: 'national', lemma: 'national' },
                   { value: 'Congress', tag: 'word', pos: 'NNP', normal: 'congress', lemma: 'congress' },
                   { value: 'came', tag: 'word', pos: 'VBD', normal: 'came', lemma: 'come' },
                   { value: 'home', tag: 'word', pos: 'NN', normal: 'home', lemma: 'home' },
                   { value: 'yesterday', tag: 'word', pos: 'NN', normal: 'yesterday', lemma: 'yesterday' },
                   { value: '.', tag: 'punctuation', pos: '.', normal: '.' } ];

    expect( tagSentence( 'Walter Sisulu and the African National Congress came home yesterday.' ) ).to.deep.equal( output );
  } );

  it( 'should tags raw tokens correctly', function () {
    var output = [ { value: 'Umkhonto', tag: 'word', pos: 'NNP', normal: 'umkhonto', lemma: 'umkhonto' },
                   { value: 'leader', tag: 'word', pos: 'NN', normal: 'leader', lemma: 'leader' },
                   { value: 'who', tag: 'word', pos: 'WP', normal: 'who' },
                   { value: 'was', tag: 'word', pos: 'VBD', normal: 'was', lemma: 'be' },
                   { value: 'now', tag: 'word', pos: 'RB', normal: 'now' },
                   { value: '63', tag: 'number', pos: 'CD', normal: '63' },
                   { value: 'in', tag: 'word', pos: 'IN', normal: 'in' },
                   { value: '1980s', tag: 'word', pos: 'CD', normal: '1980s' },
                   { value: '.', tag: 'punctuation', pos: '.', normal: '.' } ];

    expect( tagRawTokens( [ 'Umkhonto', 'leader', 'who', 'was', 'now', '63', 'in', '1980s', '.' ] ) ).to.deep.equal( output );
  } );
} );
