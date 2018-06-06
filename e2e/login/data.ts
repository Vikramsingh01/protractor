let testData = [
    {
        input: {
            email: 'WalesCardiff',
            password: ''
        },
        result: {
            valid: false
        }
    },
    {
        input: {
            email: 'WalesCardi',
            password: 'MegaNexus@2027'
        },
        result: {
            valid: false
        }
    },
     {
        input: {
            email: 'WalesCardiff',
            password: 'Pa$$w0rd'
        },
        result: {
            valid: false
        } 
    }
];
export default testData;