import mongoose from 'mongoose';

const ChangeName = mongoose.model('ChangeName', {

    old_name: String,
    new_name: String,
    email: String,
    change_in: Date
});

export default ChangeName;