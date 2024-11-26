import * as authorsConnection from "./connection/authorConnection.js";

const authorsList = await authorsConnection.GetAuthorList();

