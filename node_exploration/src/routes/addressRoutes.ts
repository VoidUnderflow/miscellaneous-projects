import express, { Request, Response } from 'express';
import Address from '../models/Address';
import Person from '../models/Person';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const addresses = await Address.find().populate('residents');
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const address = await Address.findById(req.params.id).populate('residents');

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching address', error });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const address = new Address(req.body);
    const savedAddress = await address.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(400).json({ message: 'Error creating address', error });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('residents');

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json(address);
  } catch (error) {
    res.status(400).json({ message: 'Error updating address', error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await Person.updateMany({ addresses: req.params.id }, { $pull: { addresses: req.params.id } });

    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error });
  }
});

router.post('/:id/residents/:personId', async (req: Request, res: Response) => {
  try {
    const address = await Address.findById(req.params.id);
    const person = await Person.findById(req.params.personId);

    if (!address || !person) {
      return res.status(404).json({ message: 'Address or Person not found' });
    }

    if (!address.residents.includes(person._id)) {
      address.residents.push(person._id);
      await address.save();
    }

    if (!person.addresses.includes(address._id)) {
      person.addresses.push(address._id);
      await person.save();
    }

    res.json({
      message: 'Person added to address successfully',
      address,
      person,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding person to address', error });
  }
});

router.delete('/:id/residents/:personId', async (req: Request, res: Response) => {
  try {
    const address = await Address.findById(req.params.id);
    const person = await Person.findById(req.params.personId);

    if (!address || !person) {
      return res.status(404).json({ message: 'Address or Person not found' });
    }

    address.residents = address.residents.filter(
      residentId => residentId.toString() !== req.params.personId
    );
    await address.save();

    person.addresses = person.addresses.filter(addressId => addressId.toString() !== req.params.id);
    await person.save();

    res.json({
      message: 'Person removed from address successfully',
      address,
      person,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error removing person from address', error });
  }
});

export default router;
