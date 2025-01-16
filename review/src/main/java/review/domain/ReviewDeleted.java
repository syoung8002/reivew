package review.domain;

import java.time.LocalDate;
import java.util.*;
import lombok.*;
import review.domain.*;
import review.infra.AbstractEvent;

//<<< DDD / Domain Event
@Data
@ToString
public class ReviewDeleted extends AbstractEvent {

    private Long id;
    private String itemid;
    private Double rating;
    private String text;
    private String userid;
    private String userimg;

    public ReviewDeleted(Review aggregate) {
        super(aggregate);
    }

    public ReviewDeleted() {
        super();
    }
}
//>>> DDD / Domain Event