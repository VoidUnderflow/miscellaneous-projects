import express, { Request, Response } from 'express';
import Person from '../models/Person';
import Address from '../models/Address';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const people = await Person.find().populate('addresses');
    res.json(people);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching people', error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const person = await Person.findById(req.params.id).populate('addresses');

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    res.json(person);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching person', error });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const person = new Person(req.body);
    const savedPerson = await person.save();

    res.status(201).json(savedPerson);
  } catch (error) {
    res.status(400).json({ message: 'Error creating person', error });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const person = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('addresses');

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    res.json(person);
  } catch (error) {
    res.status(400).json({ message: 'Error updating person', error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    await Address.updateMany({ residents: req.params.id }, { $pull: { residents: req.params.id } });

    await Person.findByIdAndDelete(req.params.id);
    res.json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting person', error });
  }
});

router.post('/:id/addresses/:addressId', async (req: Request, res: Response) => {
  try {
    const person = await Person.findById(req.params.id);
    const address = await Address.findById(req.params.addressId);

    if (!person || !address) {
      return res.status(404).json({ message: 'Person or Address not found' });
    }

    if (!person.addresses.includes(address._id)) {
      person.addresses.push(address._id);
      await person.save();
    }

    if (!address.residents.includes(person._id)) {
      address.residents.push(person._id);
      await address.save();
    }

    res.json({
      message: 'Address added to person successfully',
      person,
      address,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding address to person', error });
  }
});

router.delete('/:id/addresses/:addressId', async (req: Request, res: Response) => {
  try {
    const person = await Person.findById(req.params.id);
    const address = await Address.findById(req.params.addressId);

    if (!person || !address) {
      return res.status(404).json({ message: 'Person or Address not found' });
    }

    person.addresses = person.addresses.filter(
      addressId => addressId.toString() !== req.params.addressId
    );
    await person.save();

    address.residents = address.residents.filter(
      residentId => residentId.toString() !== req.params.id
    );
    await address.save();

    res.json({
      message: 'Address removed from person successfully',
      person,
      address,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error removing address from person', error });
  }
});

export default router;
