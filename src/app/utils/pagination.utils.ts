import counterSchema from "../models/counterSchema.models";

export interface IPagination {
  page?: number;
  pageSize?: number;
  filter?: string;
  sort?: any;
}

export async function findPaginated(
  model: any,
  page?: number,
  pageSize?: number,
  query: any = {},
  sort: any = {}
): Promise<any> {
  try {
    const skip = (page! - 1) * pageSize!;
    const cursor = model.find(query).sort(sort).skip(skip).limit(pageSize);
    const results = await cursor.exec();
    return results;
  } catch (err: any) {
    Promise.reject(new Error("Erro em paginar " + err.message));
  }
}

export async function getNextSequenceValue(sequenceName: string) {
  const counter: any = await counterSchema.findById(sequenceName);

  if (!counter) {
    const newCounter = new counterSchema({
      _id: sequenceName,
      seq: 0,
    });
    await newCounter.save();
    return 0;
  } else {
    const sequenceDocument = await counterSchema.findByIdAndUpdate(
      sequenceName,
      { $inc: { seq: 1 } },
      { new: true }
    );
    return sequenceDocument!.seq;
  }
}
