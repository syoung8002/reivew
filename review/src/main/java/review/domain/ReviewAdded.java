package review.domain;

import java.time.LocalDate;
import java.util.*;
import lombok.*;
import review.domain.*;
import review.infra.AbstractEvent;

//<<< DDD / Domain Event
@Data
@ToString
public class ReviewAdded extends AbstractEvent {

    private Long id;
    private String itemid;
    private Double rating;
    private String text;
    private String userid;

    public ReviewAdded(Review aggregate) {
        super(aggregate);
    }

    public ReviewAdded() {
        super();
    }
}
//>>> DDD / Domain Event
