export const state = () => ({
    name: null,
    timelineData:{
        followers: null,
        murmurs:null,
    },
    followerCount: 0, // Add a property to store the follower count
    followingCount: 0,
});

export const mutations = {
    updateName(state, newData) {
        state.name =newData;
    },
    updateTimelineData(state, newData) {
        state.timelineData = { ...state.timelineData, ...newData };
    },
    addLikeToMurmur(state, murmurId) {
        const murmurIndex = state.timelineData.murmurs.findIndex(
            (murmur) => murmur.id === murmurId
        );
        if (murmurIndex !== -1) {
            state.timelineData.murmurs[murmurIndex].likes.push({});
        }
    },
    
    updateFollowerCount(state, count) {
        state.followerCount = count;
    },
    updateFollowingCount(state, count) {
        state.followingCount = count;
    },
};