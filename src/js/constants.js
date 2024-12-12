export const AUTH_PAGES = ['profile'];
export const RESULTS = { SUCCESS: 'Success', ERROR: 'Error'};
export const GENDERS = { MALE: 'Male', FEMALE: 'Female' };
export const PHONE_REGEX = new RegExp('^\\+7\\s\\(\\d{3}\\)\\s\\d{3}-\\d{2}-\\d{2}$');
export const API_URL = "https://blog.kreosoft.space";
export const TOKEN_LIFETIME = 1800000;
export const FILTER_SORTING = { CreateDesc: "CreateDesc", CreateAsc: "CreateAsc", LikeAsc: "LikeAsc", LikeDesc: "LikeDesc" };
export const ROLES = { Admin: "Administrator", Sub: "Subscriber" };
export const UNAUTHORIZE_ERROR = "Для выполнения этого действия необходима авторизация!";

export const ERRORS_PAGES = new Map([
    ["400", "badRequest"],
    [400, "badRequest"],
    ["403", "forbid"],
    [403, "forbid"],
    ["404", "notFound"],
    [404, "notFound"],
    ["500", "internalServerError"],
    [500, "internalServerError"],
    ["401", "Unauthorized"],
    [401, "Unauthorized"],
]);
