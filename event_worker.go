package worker

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
	"gorm.io/gorm"
)

type EventWorker struct {
	db              *gorm.DB
	eventRepo       *repository.EventRepository
	marketRepo      *repository.MarketRepository
	mu              sync.RWMutex
	processingQueue map[uint]bool
	stopChan        chan struct{}
	wg              sync.WaitGroup
}

func NewEventWorker(db *gorm.DB) *EventWorker {
	return &EventWorker{
		db:              db,
		eventRepo:       repository.NewEventRepository(db),
		marketRepo:      repository.NewMarketRepository(db),
		processingQueue: make(map[uint]bool),
		stopChan:        make(chan struct{}),
	}
}

func (w *EventWorker) Start() {
	log.Println("Event worker started...")
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			w.ProcessEvents()
		case <-w.stopChan:
			w.wg.Wait()
			fmt.Println("Event worker stopped")
			return
		}
	}
}

func (w *EventWorker) Stop() {
	close(w.stopChan)
}

func (w *EventWorker) ProcessEvents() {
	w.wg.Add(3)

	go w.ProcessScheduledEvents()
	go w.ProcessOngoingEvents()
	go w.ProcessCompletedEvents()

	w.wg.Wait()
}

func (w *EventWorker) ProcessScheduledEvents() {
	defer w.wg.Done()

	ctx := context.Background()
	var events []model.Event

	err := w.db.WithContext(ctx).
		Where("status = ? AND start_time <= ?", "scheduled", time.Now()).
		Find(&events).Error

	if err != nil {
		log.Printf("Error fetching scheduled events: %v", err)
		return
	}

	if len(events) == 0 {
		return
	}

	log.Printf("Found %d scheduled events to process", len(events))

	var wg sync.WaitGroup
	for _, event := range events {
		if w.isProcessing(event.ID) {
			continue
		}

		wg.Add(1)
		go func(evt model.Event) {
			defer wg.Done()
			w.processScheduledToOngoing(ctx, evt)
		}(event)
	}
	wg.Wait()
}

func (w *EventWorker) ProcessOngoingEvents() {
	defer w.wg.Done()

	ctx := context.Background()
	var events []model.Event

	cutoffTime := time.Now().Add(-2 * time.Hour)

	err := w.db.WithContext(ctx).
		Where("status = ? AND start_time <= ?", "ongoing", cutoffTime).
		Find(&events).Error

	if err != nil {
		log.Printf("Error fetching ongoing events: %v", err)
		return
	}

	if len(events) == 0 {
		return
	}

	log.Printf("Found %d ongoing events to check for completion", len(events))

	var wg sync.WaitGroup
	for _, event := range events {
		if w.isProcessing(event.ID) {
			continue
		}

		wg.Add(1)
		go func(evt model.Event) {
			defer wg.Done()
			w.processOngoingToCompleted(ctx, evt)
		}(event)
	}
	wg.Wait()
}

func (w *EventWorker) ProcessCompletedEvents() {
	defer w.wg.Done()

	ctx := context.Background()
	var events []model.Event

	cutoffTime := time.Now().Add(-1 * time.Hour)

	err := w.db.WithContext(ctx).
		Where("status = ? AND updated_at >= ?", "completed", cutoffTime).
		Find(&events).Error

	if err != nil {
		log.Printf("Error fetching completed events: %v", err)
		return
	}

	if len(events) == 0 {
		return
	}

	log.Printf("Found %d completed events for cleanup", len(events))

	var wg sync.WaitGroup
	for _, event := range events {
		if w.isProcessing(event.ID) {
			continue
		}

		wg.Add(1)
		go func(evt model.Event) {
			defer wg.Done()
			w.processCompletedEvent(ctx, evt)
		}(event)
	}
	wg.Wait()
}

func (w *EventWorker) processScheduledToOngoing(ctx context.Context, event model.Event) {
	w.markAsProcessing(event.ID, true)
	defer w.markAsProcessing(event.ID, false)

	log.Printf("Processing event %d: %s from scheduled to ongoing", event.ID, event.Name)

	event.Status = "ongoing"
	err := w.eventRepo.UpdateEvent(ctx, &event)
	if err != nil {
		log.Printf("Error updating event %d to ongoing: %v", event.ID, err)
		return
	}

	log.Printf("Event %d: %s is now ongoing", event.ID, event.Name)
}

func (w *EventWorker) processOngoingToCompleted(ctx context.Context, event model.Event) {
	w.markAsProcessing(event.ID, true)
	defer w.markAsProcessing(event.ID, false)

	log.Printf("Processing event %d: %s from ongoing to completed", event.ID, event.Name)

	event.Status = "completed"
	err := w.eventRepo.UpdateEvent(ctx, &event)
	if err != nil {
		log.Printf("Error updating event %d to completed: %v", event.ID, err)
		return
	}

	err = w.marketRepo.CloseMarketsByEventID(ctx, nil, event.ID)
	if err != nil {
		log.Printf("Error closing markets for event %d: %v", event.ID, err)
	} else {
		log.Printf("Closed all markets for completed event %d", event.ID)
	}

	log.Printf("Event %d: %s is now completed", event.ID, event.Name)
}

func (w *EventWorker) processCompletedEvent(ctx context.Context, event model.Event) {
	w.markAsProcessing(event.ID, true)
	defer w.markAsProcessing(event.ID, false)

	fmt.Printf("Processing completed event %d: %s for cleanup\n", event.ID, event.Name)

	fmt.Printf("Cleanup completed for event %d: %s\n", event.ID, event.Name)
}

func (w *EventWorker) isProcessing(eventID uint) bool {
	w.mu.RLock()
	defer w.mu.RUnlock()
	return w.processingQueue[eventID]
}

func (w *EventWorker) markAsProcessing(eventID uint, processing bool) {
	w.mu.Lock()
	defer w.mu.Unlock()
	if processing {
		w.processingQueue[eventID] = true
	} else {
		delete(w.processingQueue, eventID)
	}
}
