package com.NayePankh.service;

import com.NayePankh.model.Batch;
import java.util.List;

public interface BatchService {
    Batch createBatch(String batchName);
    List<Batch> getAllBatches();
    Batch getBatchById(Integer id);
    void deleteBatch(Integer id);
}
