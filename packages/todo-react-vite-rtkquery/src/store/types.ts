import { store } from './store';

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
// Infer the `RootState` and `AppDispatch` types from the store itself
export type GetState = typeof store.getState;
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
