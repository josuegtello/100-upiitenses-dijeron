const fetchRequest = async function (sets) {
    const isArray = Array.isArray(sets);
    const requests = (isArray ? sets : [sets]).map(async (set) => {
        const {
            method,
            url,
            data,
            credentials,
            contentType,
            success,
            error,
        } = set;

        const headers = {};

        if (!(data instanceof FormData)) {
            headers['Content-Type'] = contentType;
        }

        const options = {
            method,
            headers,
            body: data,
            credentials,
            cache: 'no-cache',
        };

        try {
            const response = await fetch(url, options);
            await success(response);
            return {
                url,
                status:true,
                statusText:"Ok"
            };
        } catch (err) {
            console.error('Ocurrió un problema con tu petición fetch', err);
            await error(err);
            return {
                url,
                status:null,
                statusText:"Error"
            };
        }
    });

    const results = await Promise.all(requests);
    return isArray ? results : results[0]; // Si fue una sola petición, devuelve un solo resultado
};

export default fetchRequest;
