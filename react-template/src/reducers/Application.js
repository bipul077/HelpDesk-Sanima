const initialState = {
    loading: false,
    sidebarShow: 'responsive'
};

export const Reducers = (state = initialState, { type, ...rest }) => {
    switch (type) {
        case 'set':
            return {...state, ...rest }

        case "SHOW_LOADER":
            return { ...state, loading: true };

        case "HIDE_LOADER":
            return { ...state, loading: false };

        default:
            return state;
    }
}
