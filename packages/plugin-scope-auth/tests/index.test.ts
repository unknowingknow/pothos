import { gql } from 'apollo-server';
import { execute } from 'graphql';

import exampleSchema from './example/schema';
import User from './example/user';

describe('example schema', () => {
  // test('generates expected schema', () => {
  //   expect(printSchema(lexicographicSortSchema(exampleSchema))).toMatchSnapshot();
  // });

  describe('queries', () => {
    test('query simple field scope', async () => {
      const query = gql`
        query {
          forAdmin
        }
      `;

      const result = await execute({
        schema: exampleSchema,
        document: query,
        contextValue: {
          User: new User({
            'x-user-id': '1',
            'x-roles': 'admin',
          }),
        },
      });

      expect(result).toMatchSnapshot();
    });

    test('query simple field scope (unauthorized)', async () => {
      const query = gql`
        query {
          forAdmin
        }
      `;

      const result = await execute({
        schema: exampleSchema,
        document: query,
        contextValue: {
          user: new User({
            'x-user-id': '1',
          }),
        },
      });

      expect(result).toMatchSnapshot();
    });
  });

  test('query field scope with loader', async () => {
    const query = gql`
      query {
        forDeferredAdmin
      }
    `;

    const result = await execute({
      schema: exampleSchema,
      document: query,
      contextValue: {
        User: new User({
          'x-user-id': '1',
          'x-roles': 'admin',
        }),
      },
    });

    expect(result).toMatchSnapshot();
  });

  test('query field scope with loader (unauthorized)', async () => {
    const query = gql`
      query {
        forDeferredAdmin
      }
    `;

    const result = await execute({
      schema: exampleSchema,
      document: query,
      contextValue: {
        user: new User({
          'x-user-id': '1',
        }),
      },
    });

    expect(result).toMatchSnapshot();
  });
});
