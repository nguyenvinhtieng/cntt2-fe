import { postMethod } from "./fetchData";

async function fetchUser(slug) {
    const res = await postMethod('/fetch-user', {slug});
    const { data } = res
    if(data.status) {
        return data.user;
    }
    return null;
}

export default fetchUser;