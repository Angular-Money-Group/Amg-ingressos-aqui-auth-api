import { Model } from 'mongoose';
export class DBOperators {

    public static async deleteItem<M extends Model<string>>(id: string, model: M): Promise<any> {
        return model.findByIdAndDelete(id)
            .then((result) => {
                return result;
            })
            .catch((error) => {
                return error;
            });
    }

    

    }
