const mongoose = require('mongoose')
const { certifications, departments  } = require('../lists')


const DoctorSchema = new mongoose.Schema(
    {
        userId: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: [true, 'Please provide user'],
                unique: true,
                immutable: true,
                validate: {
                    validator: async function () {
                        const results = await this.populate('userId',['role'])
                        return results.userId.role === 'doctor'
                    },
                    message: 'userId {VALUE} does not have doctor role'
                },
        },
        department: {
            type: String,
            enum: {
                    values: [ ... departments ],
                    message: '{VALUE} is not supported for department, choose another deparment'
            },
            required: [true, 'Please provide department'],
        },
        certification: {
            type: String,
            enum: {
                    values: [ ... certifications ],
                    message: '{VALUE} is not supported for cetification, choose another certification'
            },
            required: [true, 'Please provide cecrtification'],
        }
})


module.exports = mongoose.model('Doctor', DoctorSchema)