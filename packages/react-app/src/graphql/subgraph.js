import { gql } from "@apollo/client";

const GET_TRANSFERS = gql`
{
  users {
    id
    tokens {
      id
      contentURI
    }
  }
}
`;

export default GET_TRANSFERS;
