import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { itemService } from '../services/itemService';
import { matchingService } from '../services/matchingService';
import { storageService } from '../services/storageService';

const ItemsContext = createContext(null);

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLatest = useCallback(async (params = {}) => {
    setLoading(true);

    try {
      const cached = await storageService.getJSON(storageService.keys.CACHED_REPORTS, []);
      if (cached.length && !params.page && !params.status && !params.keyword) {
        setItems(cached);
      }

      const data = await itemService.getLatestReports(params);
      const nextItems = data.items || [];

      setItems(nextItems);
      if (!params.page && !params.status && !params.keyword) {
        await storageService.setJSON(storageService.keys.CACHED_REPORTS, nextItems);
      }

      return nextItems;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = useCallback(async (report) => {
    const data = await itemService.createReport(report);
    await loadLatest();
    return data;
  }, [loadLatest]);

  const searchReports = useCallback(async (filters) => {
    const data = await itemService.searchReports(filters);
    return data.items || [];
  }, []);

  const getMatchesFor = useCallback(async (item) => {
    const data = await itemService.getPotentialMatches(item._id);
    if (data?.matches?.length) {
      return data.matches;
    }

    // Fallback local matching if backend matching endpoint is unavailable.
    return matchingService.findPotentialMatches(item, items);
  }, [items]);

  const markRecovered = useCallback(async (id) => {
    const data = await itemService.markRecovered(id);
    await loadLatest();
    return data;
  }, [loadLatest]);

  const flagReport = useCallback(async (id, reason) => {
    const data = await itemService.flagReport(id, reason);
    await loadLatest();
    return data;
  }, [loadLatest]);

  const deleteReport = useCallback(async (id) => {
    const data = await itemService.deleteReport(id);
    await loadLatest();
    return data;
  }, [loadLatest]);

  const reviewFlaggedReport = useCallback(async (id, action, note) => {
    const data = await itemService.reviewFlaggedReport(id, action, note);
    await loadLatest();
    return data;
  }, [loadLatest]);

  const value = useMemo(
    () => ({
      items,
      loading,
      loadLatest,
      createReport,
      searchReports,
      getMatchesFor,
      markRecovered,
      flagReport,
      deleteReport,
      reviewFlaggedReport,
      getFlaggedReports: itemService.getFlaggedReports,
      getAdminStats: itemService.getAdminStats,
    }),
    [
      items,
      loading,
      loadLatest,
      createReport,
      searchReports,
      getMatchesFor,
      markRecovered,
      flagReport,
      deleteReport,
      reviewFlaggedReport,
    ]
  );

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
};

export const useItems = () => {
  const ctx = useContext(ItemsContext);
  if (!ctx) {
    throw new Error('useItems must be used inside ItemsProvider');
  }
  return ctx;
};
