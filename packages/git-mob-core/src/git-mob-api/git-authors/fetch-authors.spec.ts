import { jest, test, expect } from '@jest/globals';
import type { BasicResponse } from '../fetch/http-fetch';
import { fetchAuthors } from './fetch-authors';

const ghRkotzeResponse = {
  id: 123,
  login: 'rkotze',
  name: 'Richard Kotze',
};

const ghDidelerResponse = {
  id: 345,
  login: 'dideler',
  name: 'Dennis',
};

function buildBasicResponse(ghResponse: Record<string, unknown>): BasicResponse {
  return {
    statusCode: 200,
    data: ghResponse,
  };
}

const headers = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Accept: 'application/vnd.github.v3+json',
  method: 'GET',
};

test('Query for one GitHub user and check RESTful url', async () => {
  const mockedFetch = jest.fn<() => Promise<BasicResponse>>();
  mockedFetch.mockResolvedValue(buildBasicResponse(ghRkotzeResponse));

  await fetchAuthors(['rkotze'], mockedFetch);

  expect(mockedFetch).toHaveBeenCalledWith('https://api.github.com/users/rkotze', {
    headers,
  });
});

test('Query for one GitHub user and return in AuthorList', async () => {
  const mockedFetch = jest.fn<() => Promise<BasicResponse>>();
  mockedFetch.mockResolvedValue(buildBasicResponse(ghDidelerResponse));

  const actualAuthorList = await fetchAuthors(['dideler'], mockedFetch);

  expect(actualAuthorList).toEqual({
    dideler: {
      name: 'Dennis',
      email: '345+dideler@users.noreply.github.com',
    },
  });
});

// test('Query for two GitHub users and build AuthorList', async t => {
//   const httpFetchStub = sandbox
//     .stub()
//     .onCall(0)
//     .resolves(buildBasicResponse(ghDidelerResponse))
//     .onCall(1)
//     .resolves(buildBasicResponse(ghRkotzeResponse));

//   const actualAuthorList = await fetchAuthors(['dideler', 'rkotze'], httpFetchStub);

//   t.deepEqual(actualAuthorList, {
//     dideler: {
//       name: 'Dennis',
//       email: '345+dideler@users.noreply.github.com',
//     },
//     rkotze: {
//       name: 'Richard Kotze',
//       email: '123+rkotze@users.noreply.github.com',
//     },
//   });
// });

// test('Http status code 404 throws error', async t => {
//   const httpFetchStub = sandbox.stub().resolves({
//     statusCode: 404,
//     data: {},
//   });

//   await t.throwsAsync(async () => fetchAuthors(['notaUser'], httpFetchStub), {
//     message: 'GitHub user not found!',
//   });
// });

// test('Http status code not 200 or 404 throws generic error', async t => {
//   const httpFetchStub = sandbox.stub().resolves({
//     statusCode: 500,
//     data: {},
//   });

//   await t.throwsAsync(async () => fetchAuthors(['badrequestuser'], httpFetchStub), {
//     message: 'Error failed to fetch GitHub user! Status code 500.',
//   });
// });
