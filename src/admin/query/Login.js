export const getLoginAuth0Mtn = function(identities, token, clientId){
    return {
        "query": `mutation LoginUserWithAuth0Lock ($input: LoginUserWithAuth0LockInput!) {
          loginUserWithAuth0Lock(input: $input) {
            user {
              id
              username
              fullName
              gender
              email
              image
              country
              lastLogin
              createdAt
              dateOfBirth
              meta { edges { node { id, item, value } }}
              roles { edges { node { id, name } }}
            }
          }
        }`,
        "variables": {
              "input": {
                "identity": identities,
                "access_token": token,
                "clientMutationId": clientId
              }
            }
        }
}

export const loginUserQry = function(username, password){
    return {
      "query": `mutation LoginUserQuery ($input: LoginUserInput!) {
        loginUser(input: $input) {
          token
          user {
            id
            username
            fullName
            gender
            email
            image
            country
            lastLogin
            createdAt
            dateOfBirth
            meta { edges { node { id, item, value } }}
            roles { edges { node { id, name } }}
          }
        }
      }`,
      "variables": {
        "input": {
          "username": username,
          "password": password
        }
      }

    }
}

const queries = {
  getLoginAuth0Mtn: getLoginAuth0Mtn,
  loginUserQry: loginUserQry
}

export default queries;