package com.NayePankh.service;

import com.NayePankh.model.Batch;
import com.NayePankh.repository.BatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BatchServiceImpl implements BatchService {

    @Autowired
    private BatchRepository batchRepository;

    @Override
    public Batch createBatch(String batchName) {
        if (batchRepository.findByBatchName(batchName).isPresent()) {
            throw new RuntimeException("Batch with name " + batchName + " already exists.");
        }
        Batch batch = new Batch();
        batch.setBatchName(batchName);
        return batchRepository.save(batch);
    }

    @Override
    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    @Override
    public Batch getBatchById(Integer id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found with id: " + id));
    }

    @Override
    public void deleteBatch(Integer id) {
        batchRepository.deleteById(id);
    }
}
