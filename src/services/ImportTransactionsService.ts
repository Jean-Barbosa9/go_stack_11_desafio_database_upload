import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    const transactionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);

    // TODO: Ler o arquivo enviado e fazer um loop para instanciar uma transação para cada item do arquivo e por fim, salvar todos os items na entidade.
    const registries = [
      {
        title: 'Salário',
        value: 1000,
        type: 'income',
        category: 'Ativos',
      },
      {
        title: 'NET',
        value: 340,
        type: 'outcome',
        category: 'Habitação',
      },
    ];
    const transactions = [] as Transaction[];

    registries.map(async registry => {
      const { title, value, type, category } = registry;

      const categoryEntity = await categoriesRepository.findOne({
        where: { category },
      });

      const categoryId = categoryEntity?.id;

      if (!categoryId) {
        const newCategory = categoriesRepository.create({ title: category });
        await categoriesRepository.save(newCategory);
      }

      const registryEdited = {
        title,
        value,
        type,
        category_id: categoryId,
      };
      const transaction = transactionsRepository.create(registryEdited);
      return transactions.push(transaction);
    });

    await transactionsRepository.save(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;
