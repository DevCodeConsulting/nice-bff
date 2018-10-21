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
    authorId: 6,
  },
  {
    id: 5,
    title: 'The white fleet',
    authorId: 4,
  },
  {
    id: 6,
    title: 'Processen',
    authorId: 5,
  },
  {
    id: 7,
    title: 'Sagan om ringen',
    authorId: 7
  },
  {
    id: 8,
    title: 'Sagan om de två tornen',
    authorId: 7
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
  },
  {
    id: 6,
    name: 'Charles Dickens'
  },
  {
    id: 7,
    name: 'J.R.R. Tolkien'
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
    books(query: String): [Book],
    book(id: Int): Book,
    authors: [Author]
    author: Author
  }
`;

const resolvers = {
  Query: {
    book: (_, args) => {
      return books.find(book => book.id === args.id)
    },
    books: (_, args) => {
      if (!args.query) return books;
      return books.filter(book => {
        console.log('Setting author to false');
        let authorMatch = false

        authors.forEach(author => {
          if (author.id === book.authorId && author.name.toString().toLowerCase().includes(args.query.toLowerCase())) {
            console.log('Setting author to true');
            authorMatch = true
          }
        })

        console.log('Query: ', args.query)
        console.log('authorMatch: ', authorMatch)

        let bookMatch = false
        Object.values(book).forEach(value => {
          if (value.toString().toLowerCase().includes(args.query.toLowerCase())) {
            bookMatch = true
          }
        })

        console.log('Bookmatch: ', bookMatch)
        return bookMatch || authorMatch
      });
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