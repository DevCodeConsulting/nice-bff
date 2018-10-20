const { ApolloServer, gql } = require('apollo-server');

const books = [
  {
    id: 1,
    title: 'Harry Potter and the Chamber of Secrets',
    authorId: 1,
  },
  {
    id: 2,
    title: 'Jurassic Park',
    authorId: 2,
  },
  {
    id: 3,
    title: 'Djungelboken',
    authorId: 3,
  },
  {
    id: 4,
    title: 'Oliver Twist',
    authorId: 4,
  },
  {
    id: 5,
    title: 'The white fleet',
    authorId: 5,
  },
  {
    id: 6,
    title: 'Processen',
    authorId: 5,
  }
];


const authors = [
  {
    id: 1,
    name: 'J.K Rowling'
  },
  {
    id: 2,
    name: 'Michael Crichton'
  },
  {
    id: 3,
    name: 'Rudyard Kipling'
  },
  {
    id: 4,
    name: 'J Allen'
  },
  {
    id: 5,
    name: 'Franz Kafka'
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    id: Int
    title: String
    author: Author
  }

  type Author {
    name: String
    id: Int
    books: [Book]
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book],
    authors: [Author]
    author: Author
  }
`;


const resolvers = {
  Query: {
    books: (_, args) => {
      return books;
    },
    authors: (_, args) => authors,
  },
  Author: {
    books(author) {
      console.log('author->books query');
      return books.filter(book => book.authorId === author.id);
    }
  },
  Book: {
    author(book) {
      console.log('book->author query');
      return authors.find(author => author.id === book.authorId)
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});