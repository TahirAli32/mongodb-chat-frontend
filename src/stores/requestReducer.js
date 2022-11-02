export const INITIAL_STATE = {
    loading: false,
    fetchResponse: {},
    error: false,
    errorMessage: ""
}

export const requestReducer = (state, action) => {
    switch(action.type){
        case "FETCH_START":
            return{
                loading: true,
                error: false,
                errorMessage: "",
                fetchResponse: {}
            }
        case "FETCH_SUCCESS":
            return{
                loading: false,
                error: false,
                errorMessage: "",
                fetchResponse: action.payload
            }
        case "FETCH_ERROR":
            return{
                loading: false,
                error: true,
                errorMessage: action.payload,
                fetchResponse: {}
            }
        default:
            return state
    }
}