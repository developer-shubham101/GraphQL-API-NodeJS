const express = require('express')
const expressGraphQL = require('express-graphql')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const authors = require('./gita/authors')
const chapters = require('./gita/chapters')
const verse = require('./gita/verse')
const app = express()

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents a author of a book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
  })
})



const VerseType = new GraphQLObjectType({
  name: 'Verses',
  description: 'This represents a verse of a chapter',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    chapter_number: { type: GraphQLNonNull(GraphQLInt) },
    chapter_id: { type: GraphQLNonNull(GraphQLInt) },
    externalId: { type: GraphQLNonNull(GraphQLInt) },
    text: { type: GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLNonNull(GraphQLString) },
    verse_number: { type: GraphQLNonNull(GraphQLInt) },
    verse_order: { type: GraphQLNonNull(GraphQLInt) },
    transliteration: { type: GraphQLNonNull(GraphQLString) },
    word_meanings: { type: GraphQLNonNull(GraphQLString) },
  })
})

const ChapterType = new GraphQLObjectType({
  name: 'Chapters',
  description: 'This represents a author of a book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    chapter_number: { type: GraphQLNonNull(GraphQLInt) },
    chapter_summary: { type: GraphQLNonNull(GraphQLString) },
    chapter_summary_hindi: { type: GraphQLNonNull(GraphQLString) },
    image_name: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    name_meaning: { type: GraphQLNonNull(GraphQLString) },
    name_translation: { type: GraphQLNonNull(GraphQLString) },
    name_transliterated: { type: GraphQLNonNull(GraphQLString) },
    verses_count: { type: GraphQLNonNull(GraphQLInt) },
    verses: {
      type: new GraphQLList(VerseType),
      resolve: (chapter) => {
        return verse.verse.filter(verse => verse.chapter_id === chapter.id)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    verse_by_chapter: {
      type: new GraphQLList(VerseType),
      description: 'List of verses',
      args: {
        chapterId: { type: GraphQLInt }
      },
      resolve: (parent, args) => verse.verse.filter(verse => verse.chapter_id === args.chapterId)
    },
    verse: {
      type: VerseType,
      description: 'List of verses',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => verse.verse.find(verse => verse.id === args.id)
    },
    verses: {
      type: new GraphQLList(VerseType),
      description: 'List of verses',
      resolve: () => verse.verse
    },
    chapters: {
      type: new GraphQLList(ChapterType),
      description: 'List of chapters',
      resolve: () => chapters.chapters
    },
    chapter: {
      type: ChapterType,
      description: 'List of chapters',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => chapters.chapters.find(chapter => chapter.id === args.id)
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors.authors
    },

  })
})


const schema = new GraphQLSchema({
  query: RootQueryType,
})

app.use('/', expressGraphQL({
  schema: schema,
  graphiql: true
}))

 
app.listen(process.env.PORT || 1337, () => console.log('Server Running'))